import request from 'supertest'
import app from '../../app';
import mongoose from 'mongoose';
import Group from '../../models/groups';

jest.mock('../../controller/authController');

describe('group creating route', ()=>{

  it('creates a group',async ()=>{
    
    const response = await request(app)
      .post('/group/create')
      .send({
        name: 'testGroup',
        isProtected: false
      })
      .expect(201)
      expect(response.body.data[0].id).not.toBeUndefined();
  })
  
  it('generates unique g_id for group', async ()=>{
    const group1 = await request(app)
      .post('/group/create')
      .send({
        name: 'testGroup',
        isProtected: false
      })
      .expect(201)
    const group2 = await request(app)
      .post('/group/create')
      .send({
        name: 'testGroup',
        isProtected: false
      })
      .expect(201)
    expect(group1.body.data[0].g_id).not.toEqual(group2.body.data[0].g_id)
  })
  it.todo('throws error if not logged in')
  it.todo('throws if password not provided for protected group')
  it.todo('throws if name is invalid')
})

describe('get group group', ()=>{
  it('get group with id', async ()=>{
    const response = await request(app)
      .post('/group/create')
      .send({
        name: 'testGroup',
        isProtected: false
      })
      .expect(201)
    
    let { id }= response.body.data[0];
  
    const group = await request(app)
      .get(`/group/${id}`)
      .expect(200)
  
    expect(group.body.data[0].id).toEqual(id);
  })
  
  it.todo('return empty object if not found')
  it.todo('throws error if invalid id is provided')
})

describe('handling members in group', ()=>{
  it('join group as current user', async ()=>{
    let response = await request(app)
      .post('/group/create')
      .send({
        name: 'testGroup',
        isProtected: false
      })
      .expect(201)
    let groupid = response.body.data[0].id;
    let userid = new mongoose.Types.ObjectId();
    // console.log(groupid)
    let updatedGroup = await request(app)
    .post(`/group/${groupid}/join`)
    .expect(200)

    const group = await Group.findById(groupid);
    expect(group.members.length).toEqual(2);
  })
  
  it('leave as a group as current user', async ()=>{
    let response = await request(app)
    .post('/group/create')
    .send({
      name: 'testGroup',
      isProtected: false
    })
    .expect(201)
    let groupid = response.body.data[0].id;
    let currentUserId = new mongoose.Types.ObjectId();
    await request(app)
    .post(`/group/${groupid}/join`)
    .send({
      currentUserId
    })
    .expect(200)

    await request(app)
      .patch(`/group/${groupid}/leave`)
      .send({
        currentUserId
      })
      .expect(200)
    const group = await Group.findById(groupid);
    expect(group.members.length).toEqual(1);
  })
  it.todo('throws if memeber already exists')
  it.todo('admin promotes member')
  it.todo('admin can demote itself')
  it.todo('group must have atleast one admin')
  it.todo('admin can update group password')
  it.todo('admin can remove group password')
  it.todo('admin can remove member')
})

describe('querying group', ()=>{
  it('gets group with matching name and id', ()=>{
    
  })
  it.todo('returns member having specific permission level')
  it.todo('member belongs to a given group')
  it.todo('filters protected groups')
  it.todo('filters protected groups')
})

describe('handling group', ()=>{

})
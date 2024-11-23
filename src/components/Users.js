import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
const Users = () => {
  const [users, setUsers] = useState(null);
  const [show, setShow] = useState(false);
  const [disbleInput,setDisableInput]=useState(false);
  const [id,setId]=useState(null);
  const [newUser, setNewUser] = useState({ name: '', role: '', status: 'Active' });
  const [errors, setErrors] = useState({});
  const [mockRoles,setMockRole]=useState([]);
  useEffect(() => {
    getData();
    getRole();
  }, []);
  const validateForm = () => {
    const newErrors = {};
    if (!newUser.name.trim()) {
      newErrors.name = 'Name is required.';
    } else if (newUser.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
    }

    if (!newUser.role.trim()) {
      newErrors.role = 'Role is required.';
    }

    return newErrors;
  };
  const getRole= async()=>{
    await fetch("http://localhost:8080/roles").then((response) => response.json())
      .then((result) => {
        const roleArray=[];
        // eslint-disable-next-line array-callback-return
        result.map((item,index)=>{
          roleArray.push(item);
        })
        setMockRole(roleArray);
      })
  }
  const getData = async() => {
   await fetch("http://localhost:8080/users").then((response) => response.json())
      .then((result) => {
        setUsers(result)
      })
  }
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setDisableInput(false);
    reserForm();
    setErrors({});
  };
  const editUser=async()=>{
    await fetch(`http://localhost:8080/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        id: id,
        name: newUser.name,
        role:newUser.role,
        status:newUser.status
      }),
      headers: {
        'Content-type': 'application/json',
      },
    }).then((response) => response.json()).then((result) => {
      setId(null);
      Swal.fire("Data Updated Successfully!");
      getData();
    });
  }
  const createUser=async()=>{
    await fetch('http://localhost:8080/users/', {
      method: 'POST',
      body: JSON.stringify({
        name: newUser.name,
        role:newUser.role,
        status:newUser.status
      }),
      headers: {
        'Content-type': 'application/json',
      },
    }).then((response) => response.json()).then((result) => {
      Swal.fire("Data Saved Successfully!");
      getData();
    });
  }
  const handleAddUser = () => {
    const formErrors = validateForm();
    if(Object.keys(formErrors).length === 0){
      if(id){
        editUser();
      }else{
        createUser();
      } 
      setErrors({});
      reserForm();
      handleClose();
    }else {
      setErrors(formErrors);
    }
    
  };

  const reserForm=()=>{
    setNewUser({
      name: '',
      role: '', 
      status: 'Active' 
    })
  }
  const getUser=(usrId)=>{
    fetch(`http://localhost:8080/users?id=${usrId}`)
    .then((response)=>response.json())
    .then((result)=>{
      // console.log(result);
      setNewUser({
        name: result[0].name,
        role: result[0].role, 
        status: result[0].status 
      })
    });
    setShow(true);
  }
  const handleViewUser=(usrId)=>{
    getUser(usrId);
    setDisableInput(true);
    // console.log(user);
  }
  const handleEditUser=(userId)=>{
    setId(userId);
    getUser(userId);
    setShow(true);
    // console.log(user);
  }
  const handleDeleteUse=(userId)=>{
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost:8080/users/" + userId,{
          method: 'DELETE'
        }).then((response) => response.json())
        .then((result) => {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
          getData()
        },(error)=>{
          console.log(error);
        })
      }
    });
  }
  return (
    <div className="container">
      <h2>User Management</h2>
      <Button className="mb-3" onClick={handleShow}>Add User</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users && users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <i className="bx bx-show nav_icon btn" onClick={()=>handleViewUser(user.id)}></i>
                <i className="bx bx-edit nav_icon btn" onClick={()=>handleEditUser(user.id)}></i>
                <i className="bx bx-trash nav_icon btn"onClick={()=>handleDeleteUse(user.id)} ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>User Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name<span className='text-danger'>*</span></Form.Label>
              <Form.Control
                disabled={disbleInput}
                type="text"
                placeholder="Enter name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                isInvalid={!!errors.name}
              />
              {errors.name && <div className='text-danger'>{errors.name}</div>}
            </Form.Group>
            <Form.Group>
              <Form.Label>Role<span className='text-danger'>*</span></Form.Label>
              <Form.Select
                disabled={disbleInput}
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                isInvalid={!!errors.role}
              >
                <option>Select Role</option>
                {mockRoles && mockRoles.map((role) => (
                  <option key={role.id} value={role.rolename}>
                    {role.rolename}
                  </option>
                ))}
              </Form.Select>
              {errors.role && <div className='text-danger'>{errors.role}</div>}
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                disabled={disbleInput}
                value={newUser.status}
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          {!disbleInput && <Button variant="primary" onClick={handleAddUser}>{id ?"Update":"Add"}</Button>}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;

import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { mockRoles } from '../data/mockData';
import Swal from 'sweetalert2';
import { permissionOptions } from '../constants/constant';
const Roles = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [show, setShow] = useState(false);
  const [roleId,setRoleId]=useState(null);
  const [newRole, setNewRole] = useState({ rolename: '', permissions:[]});
  const [errors, setErrors] = useState({});
  useEffect(()=>{
    getData();
  },[]);
  const validateForm = () => {
    const newErrors = {};
    if (!newRole.rolename.trim()) {
      newErrors.rolename = 'Role Name is required.';
    }
    return newErrors;
  };
  const getData = async() => {
    await fetch("http://localhost:8080/roles").then((response) => response.json())
      .then((result) => {
        setRoles(result)
      })
  }
  const handlePermissionChange = (e) => {
    const { value, checked } = e.target;
    setNewRole((prevRole) => {
      const updatedPermissions = checked
        ? [...prevRole.permissions, value]
        : prevRole.permissions.filter((permission) => permission !== value);

      return { ...prevRole, permissions: updatedPermissions };
    });
  };
  const handleShow = () => setShow(true);
  const handleClose = () => {
    reserForm();
    setShow(false);
    setErrors({});
  };
  const reserForm=()=>{
    setNewRole({
      rolename: '',
      permissions: [], 
    })
  }
  const editRole=async()=>{
    await fetch(`http://localhost:8080/roles/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify({
        id: roleId,
        rolename: newRole.rolename,
        permissions:newRole.permissions,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    }).then((response) => response.json()).then((result) => {
      setRoleId(null);
      Swal.fire("Role Updated Successfully!");
      getData();
    });
  }
  const createRole=async()=>{
    await fetch('http://localhost:8080/roles/', {
      method: 'POST',
      body: JSON.stringify({
        rolename: newRole.rolename,
        permissions:newRole.permissions
      }),
      headers: {
        'Content-type': 'application/json',
      },
    }).then((response) => response.json()).then((result) => {
      Swal.fire("Role Added Successfully!");
      getData();
    })
  }
  const handleAddRole = async() => {
    // console.log(newRole);
    const formErrors = validateForm();
    if (!newRole.permissions) {
      newRole.permissions = [];
    }
    if(Object.keys(formErrors).length === 0){
      if(roleId){
        editRole();
      }else{
        createRole();
      } 
      setErrors({});
      reserForm();
      handleClose();
    }else {
      setErrors(formErrors);
    }
  };
  const getRole=(roleId)=>{
    fetch(`http://localhost:8080/roles?id=${roleId}`)
    .then((response)=>response.json())
    .then((result)=>{
      // console.log(result);
      const permissions = 
      typeof result[0].permissions === 'string'
        ? JSON.parse(result[0].permissions)
        : result[0].permissions;
      setNewRole({
        rolename: result[0].rolename,
        permissions: permissions, 
      })
    });
    setShow(true);
  }
  const handleEditRole=(roleId)=>{
    setRoleId(roleId);
    getRole(roleId);
    setShow(true);
    // console.log(user);
  }
  const handleDeleteRole=(roleId)=>{
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
        fetch("http://localhost:8080/roles/" + roleId,{
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
      <h2>Role Management</h2>
      <Button className="mb-3" onClick={handleShow}>Add Role</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Role</th>
            <th>Permissions</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles && roles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.rolename}</td>
              <td>
                {(() => {
                  try {
                    const permissions = 
                      typeof role.permissions === 'string'
                        ? JSON.parse(role.permissions)
                        : role.permissions;

                    return Array.isArray(permissions) ? permissions.join(', ') : 'Invalid permissions';
                  } catch (error) {
                    console.error('Error parsing permissions:', error);
                    return 'Invalid permissions';
                  }
                })()}
              </td>

              <td>
              <i className="bx bx-edit nav_icon btn" onClick={()=>handleEditRole(role.id)}></i>
              <i className="bx bx-trash nav_icon btn"onClick={()=>handleDeleteRole(role.id)} ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{roleId ? "Update Role" :"Add Role"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Role Name<span className='text-danger'>*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Role name"
                value={newRole.rolename}
                onChange={(e) => setNewRole({ ...newRole, rolename: e.target.value })}
                isInvalid={!!errors.rolename}
              />
              {errors.rolename && <div className='text-danger'>{errors.rolename}</div>}
            </Form.Group>
            <Form.Group>
              <Form.Label>Permission</Form.Label>
              {permissionOptions.map((option) => (
              <Form.Check
                key={option.id}
                type="checkbox"
                label={option.rolename}
                value={option.rolename}
                checked={newRole.permissions.includes(option.rolename)}
                onChange={handlePermissionChange}
              />
            ))}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleAddRole}>{roleId ?"Update Role":"Add Role"}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Roles;

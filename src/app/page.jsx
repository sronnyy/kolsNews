"use client"

import Nav from '@/Components/Nav';
import Main from '@/Components/Main';
import Form from '@/Components/Utils/Form';
import Grid from '@/Components/Utils/Grid';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(null);
  const gridRef = useRef(null);

  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8800");
      setUsers(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleRunAll = () => {
    if (gridRef.current) {
      gridRef.current.handleRunAll();  // Chama o handleRunAll no componente Grid
    }
  };
  
  return (
    <div className=''>

      <Nav onRunAllClick={handleRunAll} className="">
        <Form onEdit={onEdit} setOnEdit={setOnEdit} getUsers={getUsers} />

      </Nav>

      <Main className="bg-white flex justify-center items-center h-screen ">

        <Grid ref={gridRef} setOnEdit={setOnEdit} users={users} setUsers={setUsers} />

      </Main>

      <ToastContainer autoClose={3000} position="bottom-left" />

    </div>
  );
}
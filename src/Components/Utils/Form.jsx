"use client"

import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import CustomButton from '../Utils/Button'; // Importe o botão

const Form = ({ getUsers, onEdit, setOnEdit }) => {
  const nomeRef = useRef(null);
  const keyRef = useRef(null);
  const postRef = useRef(null);



  useEffect(() => {
    if (onEdit) {
      if (nomeRef.current && keyRef.current && postRef.current) {
        nomeRef.current.value = onEdit.nome || '';
        keyRef.current.value = onEdit.key || '';
        postRef.current.value = onEdit.post || '';
      }
    }
  }, [onEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nome = nomeRef.current?.value;
    const key = keyRef.current?.value;
    const post = postRef.current?.value;

    // Verifica se o campo 'post' contém apenas números
    if (isNaN(post) || post.trim() === '') {
      return toast.warn("O campo Post deve conter apenas números!");
    }

    if (!nome || !key || !post) {
      return toast.warn("Preencha todos os campos!");
    }

    try {
      if (onEdit) {
        await axios.put(`http://localhost:8800/${onEdit.id}`, {
          nome,
          key,
          post
        });
        toast.success("Usuário atualizado com sucesso.");
      } else {
        await axios.post("http://localhost:8800", {
          nome,
          key,
          post,
        });
        toast.success("Usuário criado com sucesso.");
      }
    } catch (error) {
      toast.error("Ocorreu um erro: " + (error.response?.data || error.message));
    }

    if (nomeRef.current && keyRef.current && postRef.current) {
      nomeRef.current.value = "";
      keyRef.current.value = "";
      postRef.current.value = "";
    }

    setOnEdit(null);
    getUsers();
  };

  return (
    <div className="flex">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-sm">
        <div className="flex flex-col">
          <label htmlFor="nome" className="mb-1 text-white hidden">Name</label>
          <input
            name="nome"
            id="nome"
            ref={nomeRef}
            className="w-52 p-2 border border-gray-300 rounded-sm h-10 bg-transparent text-white"
            placeholder="Insert users"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="key" className="mb-1 text-white hidden">Keyword</label>
          <input
            name="key"
            id="key"
            ref={keyRef}
            className="w-32 p-2 border border-gray-300 rounded-sm h-10 bg-transparent text-white"
            placeholder="Insert keyword"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="post" className="mb-1 text-white hidden">Post</label>
          <input
            name="post"
            id="post"
            type="text"
            ref={postRef}
            pattern="[0-9]*"  // Restringe a entrada para apenas números
            className="w-16 p-2 border border-gray-300 rounded-sm h-10 bg-transparent text-white"
            title="Somente números são permitidos."
            placeholder="Posts"
          />
        </div>

        <button type="submit" className="px-4 py-2 rounded-sm bg-blue-600 text-white border-none cursor-pointer hover:bg-blue-700"> SAVE </button>
      </form>
      
      
    </div>
    
);
};

export default Form;

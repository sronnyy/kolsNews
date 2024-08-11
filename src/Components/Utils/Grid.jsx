import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaSpinner, FaPlay, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import CustomButton from '../Utils/Button'; // Importe o botão

const Grid = forwardRef(({ users, setUsers, setOnEdit, runAllRef }, ref) => {
  const [loading, setLoading] = useState(null);
  const [allLoading, setAllLoading] = useState(false);
  const [activationUrls, setActivationUrls] = useState({});
  const [dates, setDates] = useState({});
  const [renderToggle, setRenderToggle] = useState(false);
  const [expandedUser, setExpandedUser] = useState(null);
  const [tweetLoading, setTweetLoading] = useState(null);
  const [running, setRunning] = useState(false); 




  useImperativeHandle(ref, () => ({
    handleRunAll
  }));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDates = localStorage.getItem("dates");
      if (storedDates) {
        setDates(JSON.parse(storedDates));
      }
    }
  }, []);

  const handleEdit = (item) => {
    setOnEdit(item);
  };

  useEffect(() => {
    const fetchActivationUrlsForUsers = async () => {
      try {
        const urls = {};
        for (const user of users) {
          const response = await axios.get(`http://localhost:8800/activation-urls/${user.nome}`);
          if (response.data) {
            urls[user.nome] = response.data;
          }
        }
        setActivationUrls(urls);
      } catch (error) {
        toast.error(`Error fetching activation URLs: ${error.response?.data || error.message}`);
      }
    };

    fetchActivationUrlsForUsers();
  }, [users, renderToggle]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8800/${id}`);
      const newArray = users.filter((user) => user.id !== id);
      setUsers(newArray);
      toast.success(response.data);
    } catch (error) {
      toast.error(error.response?.data || error.message);
    }
    setOnEdit(null);
  };

  const handleRun = async (item) => {
    if (running) {
      toast.error("Another run is currently in progress. Please wait.");
      return;
    }
    setRunning(true);
    setLoading(item.nome);
    setTweetLoading(item.nome)
    try {
      const response = await axios.post("http://localhost:8800/run", {
        name: item.nome,
        key: item.key,
        postCount: Number(item.post),
        dateOne: dates[item.nome]?.dateOne,
        dateTwo: dates[item.nome]?.dateTwo,
      });
      toast.success(response.data.message);
      setRenderToggle((prev) => !prev);
    } catch (error) {
      toast.error(`Error running script for ${item.nome}: ${error.response?.data || error.message}`);
    } finally {
      setRunning(false);
      setLoading(null);
      setTweetLoading(null);
    }
  };


  const handleRunAll = useCallback(async () => {
    if (running) {
      toast.error("Another run is currently in progress. Please wait.");
      return;
    }
    setRunning(true);
    setAllLoading("all");
    setTweetLoading("all");
    try {
      for (const user of users) {
        setLoading(user.nome);
        await axios.post("http://localhost:8800/run", {
          name: user.nome,
          key: user.key,
          postCount: Number(user.post),
          dateOne: dates[user.nome]?.dateOne,
          dateTwo: dates[user.nome]?.dateTwo,
        });
        toast.success(`Script run for ${user.nome}`);
      }
      setRenderToggle((prev) => !prev);
    } catch (error) {
      toast.error(`Error running script for some users: ${error.response?.data || error.message}`);
    } finally {
      setRunning(false);
      setAllLoading(false);
      setLoading(null); // Moved here to ensure it runs after all processes
      setTweetLoading(null); // Limpa o loading após o término
    }
  }, [running, users, dates]);


  const handleDateChange = (userName, dateType, value) => {
    setDates((prevDates) => {
      const newDates = {
        ...prevDates,
        [userName]: {
          ...prevDates[userName],
          [dateType]: value,
        },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("dates", JSON.stringify(newDates));
      }
      return newDates;
    });
  };

  useEffect(() => {
    if (runAllRef) {
      runAllRef.current = handleRunAll;
    }
  }, [runAllRef, handleRunAll]);

  const toggleAccordion = (userName) => {
    setExpandedUser((prev) => (prev === userName ? null : userName));
  };


  return (
    <div className="shadow-md rounded w-full bg-[#f7f7f7] p-8 px-3">
      
      <div className="w-full hidden">
        <div className="flex justify-between py-4 px-4 items-center">
          <h1 className="text-5xl uppercase font-semibold">Kols</h1>
          
          <CustomButton loading={allLoading} handleClick={handleRunAll}>
            RUN
          </CustomButton>

        </div>
      </div>

      <div className="w-full">
        {users.map((item, i) => (
          <div key={i} className={`w-full`}>
            <div className="p-4 py-1">
              <div className=" px-4 bg-white shadow-md mb-2 py-4">
                <div className="flex flex-col gap-">

                  <div className="flex items-center justify-between">

                    <a href={`https://x.com/${item.nome}`} className="text-blue-500 underline flex gap-2 items-center">@{item.nome}</a>
                      <p className="flex gap-1 items-center">
                        <span className="uppercase font-semibold">Keyword:</span>
                        {item.key}
                      </p>

                    <div className="flex gap-2">
                      
                      <div className=" flex items-center gap-2 fl">

                        <input
                          type="date"
                          value={dates[item.nome]?.dateOne || ""}
                          onChange={(e) => handleDateChange(item.nome, "dateOne", e.target.value)}
                          className="border p-1 rounded-sm"
                        />

                      </div>

                      <div className=" flex items-center ">
  
                        <input
                          type="date"
                          value={dates[item.nome]?.dateTwo || ""}
                          onChange={(e) => handleDateChange(item.nome, "dateTwo", e.target.value)}
                          className="border p-1 rounded-sm"
                        />

                      </div>

                    </div>

                    <div onClick={() => toggleAccordion(item.nome)} className="flex flex-col justify-center items-center p-1 px-4 bg-[#f7f7f7] cursor-pointer relative">
                      <div className="flex gap-2 items-center w-full">
                        <span className="uppercase font-medium text-black rounded-sm flex gap-2">
                           Posts: 
                          <div>
                            {activationUrls[item.nome]?.filter((url) => url.tweet_url).length || 0} / {item.post}
                          </div>
                            
                        </span>
                        {expandedUser === item.nome ? <FaChevronUp /> : <FaChevronDown />}
                      </div>

                      <div className=" absolute z-50 -left-40 top-12 w-[30rem]">
                        <div className={`transition-all  duration-500 ease-in-out overflow-hidden  ${expandedUser === item.nome ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                          {expandedUser === item.nome && activationUrls[item.nome] && (
                            <ul className="list-disc flex flex-col gap-2  bg-gray-100 rounded-md py-8 px-10">
                              {Array.from({ length: item.post }).map((_, i) => (
                                <li key={i} className="text-blue-600 ">
                                  <div className="flex justify-between">
                                    {activationUrls[item.nome][i]?.tweet_url ? (
                                      <>
                                        <a href={activationUrls[item.nome][i].tweet_url} target="_blank" rel="noopener noreferrer">
                                          Tweet {i + 1} -
                                        </a>
                                        <span className="text-black">({activationUrls[item.nome][i].created_at})</span>
                                        <button
                                          className="text-red-500"
                                          onClick={() => handleDeleteTweet(activationUrls[item.nome][i].id, item.nome)}
                                        >
                                          <FaTrash />
                                        </button>
                                      </>
                                    ) : (

                                      <span className="text-gray-400 flex items-center">
                                        {tweetLoading === item.nome ? "Waiting tweets" : "No tweets available"}
                                        {loading === item.nome && <FaSpinner className="animate-spin inline-block ml-2" />}
                                      </span>

                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">

                      <button
                        className={`bg-blue-500 rounded-md transition-all text-white p-2 text-center${allLoading || loading === item.nome || running ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer hover:bg-blue-600"}`}
                        onClick={() => !allLoading && loading !== item.nome && !running && handleEdit(item)}
                        disabled={allLoading || loading === item.nome || running}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className={`bg-red-500 text-white transitin-all p-2 rounded-md text-center ${allLoading || loading === item.nome || running ? "opacity-50 cursor-not-allowed" : "opacity-100 hover:bg-red-600"}`}
                        onClick={() => !allLoading && loading !== item.nome && !running && handleDelete(item.id)}
                        disabled={allLoading || loading === item.nome || running}
                      >
                        <FaTrash />
                      </button>

                      <button
                        className={`px-2 py-2 bg-green-600 text-white rounded-md  transition-all ${loading === item.nome || allLoading || running ? "opacity-50" : "py-1 opacity-100 hover:bg-green-700"}`}
                        onClick={() => !running && handleRun(item)}
                        disabled={allLoading || loading === item.nome || running}
                      >
                        {loading === item.nome ? <FaSpinner className="animate-spin text-xl" /> : <FaPlay />}
                      </button>
                      



                    </div>

                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

Grid.displayName = 'Grid'; // Adicione esta linha

export default Grid;

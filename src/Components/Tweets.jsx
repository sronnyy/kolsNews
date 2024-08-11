"use client"

// components/Tweets.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Tweets = () => {
  const [tweets, setTweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteUserName, setDeleteUserName] = useState("");

  const getTweets = async () => {
    try {
      const res = await axios.get("http://localhost:3010/tweets");
      setTweets(res.data);
    } catch (error) {
      toast.error("Error fetching tweets: " + error.message);
    }
  };

  const refreshTweets = async () => {
    await getTweets();
    toast.success("Tweets refreshed!");
  };

  const handleDeleteTweet = async (tweetId) => {
    try {
      await axios.delete(`http://localhost:3010/tweet/${tweetId}`);
      toast.success(`Tweet with ID ${tweetId} deleted successfully.`);
      await getTweets(); // Atualize a lista de tweets após a exclusão
    } catch (error) {
      toast.error("Error deleting tweet: " + error.message);
    }
  };

  const handleDeleteTweets = async () => {
    if (!deleteUserName) {
      toast.error("Please enter a user name.");
      return;
    }

    const userExists = tweets.some(tweet => tweet.user_name.toLowerCase() === deleteUserName.toLowerCase());

    if (!userExists) {
      toast.error(`User ${deleteUserName} does not exist.`);
      return;
    }

    try {
      await axios.delete(`http://localhost:3010/tweets/${deleteUserName}`);
      toast.success(`Tweets for user ${deleteUserName} deleted successfully.`);
      setDeleteUserName("");
      await getTweets();
    } catch (error) {
      toast.error("Error deleting tweets: " + error.message);
    }
  };

  useEffect(() => {
    getTweets();
  }, []);

  const matchesSearchTerm = (tweet, term) => {
    const userNamePrefix = tweet.user_name.slice(0, 5).toLowerCase();
    const searchTermPrefix = term.slice(0, 5).toLowerCase();
    return userNamePrefix.startsWith(searchTermPrefix);
  };

  const filteredTweets = tweets.filter((tweet) => {
    const matchesTerm = searchTerm ? matchesSearchTerm(tweet, searchTerm) : true;
    const matchesDeleteUserName = deleteUserName ? tweet.user_name.toLowerCase().includes(deleteUserName.toLowerCase()) : true;
    return matchesTerm && matchesDeleteUserName;
  });

  return (
    <div className="w-full h-20">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-black text-center uppercase hidden">Tweets</h2>
        <div className="flex items-center gap-4">

          <button onClick={refreshTweets} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
            Refresh Tweets
          </button>

          <div className="flex flex-row-reverse gap-2">

            <input
              type="text"
              placeholder="User name to delete tweets"
              value={deleteUserName}
              onChange={(e) => setDeleteUserName(e.target.value)}
              className="w-1/2 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <button onClick={handleDeleteTweets} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300">
              Delete Tweets
            </button>

          </div>
        </div>

        <input
          type="text"
          placeholder="Search by user name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>
      <div className="max-h-[22rem] overflow-y-scroll">

        {filteredTweets.length > 0 ? (
          filteredTweets.map((tweet) => (
            <div key={tweet.url} className="bg-white p-4 m-2 rounded shadow flex flex-col gap-4">
              <p className="text-blue-600 text-xl uppercase font-bold">User: {tweet.user_name}</p>
              <div>
                <p><strong>URL:</strong> <a className="text-blue-600" href={tweet.url} target="_blank" rel="noopener noreferrer">{tweet.url}</a></p>
                <p className='hidden'><strong>Text:</strong> {tweet.full_text}</p>             
                <p><strong>Key:</strong> {tweet.tweet_key}</p>
                <button
                  onClick={() => handleDeleteTweet(tweet.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 mt-2"
                >
                  Delete Tweet
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-black">No tweets found.</p>
        )}

      </div>
    </div>
  );
};

export default Tweets;

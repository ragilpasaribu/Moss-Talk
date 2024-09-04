/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { RiUserSearchFill } from "react-icons/ri";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect } from "react";
import { GrFormClose } from "react-icons/gr";

const SearchUser = ({onClose}) => {

  const [searchUser, setSearchUser] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchUser = async () => {
    const URL = "http://localhost:8080/api/search-user";
    setLoading(true);
    try {
      const response = await axios.post(URL, {
        search: search,
      });
      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);    
    }
  };

  useEffect(() => {
    if (search) { // hanya mencari ketika ada input dari user
      handleSearchUser();
    } else {
      setSearchUser([]); // reset searchUser jika input kosong
    }
  }, [search]);

  console.log('search User', searchUser);
  return (
    <div className="fixed top-0 bottom-0 right-5 left-0 bg-slate-800 bg-opacity-40 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-10">
        <div className="bg-white rounded h-14 overflow-hidden flex">
          <input
            type="text"
            placeholder="Cari Pengguna Dengan Nama, Email ...."
            className="w-full outline-none py-1 h-full px-4"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />

          <div className="h-14 w-14 flex justify-center items-center">
            <RiUserSearchFill size={25} />
          </div>
        </div>

        <div className="bg-white w-full mt-2 p-4 rounded">
          {
            loading ? ( // jika sedang loading, tampilkan komponen loading
              <Loading />
            ) : (
              searchUser.length === 0 && search ? ( // jika pencarian tidak menemukan hasil
                <p className="text-center text-slate-500">Pengguna Tidak Ditemukan</p>
              ) : (
                searchUser.map((user, index) => (
                  <UserSearchCard key={user.id} user={user} onClose={onClose}/>   
                ))
              )
            )
          }
        </div>
      </div>

      <div className="absolute top-0 right-0 text-2xl p-3 lg:text-4xl hover:text-white" onClick={onClose}>
          <button>
            <GrFormClose/>
          </button>
      </div>
    </div>
  );
};

export default SearchUser;

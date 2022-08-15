import './home.css'
import Header from "../../components/header/Header";
import Sidebar from "../../components/sizebar/Sidebar";
import Posts from "../../components/posts/Posts";
import {useEffect, useState} from "react";
import axios from "axios";
import {useLocation} from "react-router-dom";
import ReactPaginate from "react-paginate";
function Home() {
  const [currentPage,setCurrentPage] = useState(0)
  const [posts,setPosts] = useState([]);
  const {search} = useLocation();
  const PER_PAGE = 4;

  useEffect(()=>{
    const fetchData = async()=>{
      const res = await axios.get(process.env.REACT_APP_API_ENDPOINT +'/posts'+search)
      setPosts(res.data)
    }
    fetchData()
  },[search])

  useEffect(() => {
    document.title = "React & Node Blog";
  });

  function handlePageClick({selected: selectedPage}){
    console.log('selected page',selectedPage)
    setCurrentPage(selectedPage)
  }
  const offset = currentPage * PER_PAGE

  const currentPageData = posts.slice(offset,offset +PER_PAGE)
  const pageCount = Math.ceil(posts.length / PER_PAGE)
  return (
      <>
        <Header/>
        <div className="home">
          <div className='leftDiv'>
            <Posts posts={currentPageData} />
            <ReactPaginate
                previousLabel="< Previous"
                nextLabel="Next >"
                pageCount={pageCount}
                onPageChange={handlePageClick}
                renderOnZeroPageCount={null}
                containerClassName={"pagination"}
                previousClassName={'pagination_link'}
                nextLinkClassName={'pagination_link'}
                disabledClassName={'pagination_link-disabled'}
                activeClassName={'pagination_link-active'}
            />
          </div>
          <Sidebar/>
        </div>

      </>
  )
}

export default Home
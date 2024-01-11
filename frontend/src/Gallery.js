import {useParams, useNavigate} from "react-router-dom"
import { useState,useEffect } from "react";
import axios from "axios"
import InfiniteScroll from 'react-infinite-scroller';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import "./Gallery.css"

function Gallery(){
    const {id} = useParams();
    const navigate=useNavigate();
    const [vid,setVid]= useState(null);
    const [sug,setSug] = useState([]);
    const [pageid,setPageid] = useState([]);
    async function fetchvid(){
        const response= await axios.post('http://localhost:5000/currentvid',JSON.stringify(id), {
            headers: {
              'Content-Type': 'application/json'
            },
            responseType: 'blob',
          }
        )
        setVid(URL.createObjectURL(response.data));
    }
    async function fetchthumb(ord){
        const url_='http://localhost:5000/thumbnail?order='+ord
        const response= await axios.get(url_);
        console.log(response);
        setSug([...response.data.result])
        setPageid([...response.data.id])
    }
    function traverse(idcurr){
        console.log("huh")
        const path="../gallery/"+idcurr;
        return navigate(path, { replace: true });
    }
    useEffect(() => {
        fetchvid();
        fetchthumb("1");
    }, [id]);
    
    return (
        <Container fluid style={{maxHeight:"80vh",overflow:"hidden"}}>
        <Row style={{marginTop:"2rem"}}>
            <Col sm={10} style={{marginTop:"1rem"}}>
            <Row><video key={vid} width="480" height="400" controls style={{width:"36rem",margin:"auto"}}><source src={vid} type="video/mp4" /></video></Row>
            <Row><a href={vid} download="artvideo" className="btn btn-light" style={{width:"35rem",margin:"auto"}}>Download</a></Row>
            </Col>
            <Col sm={2}>
                <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic">Sort Videos By</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1" onClick={() => fetchthumb("-1")}>Newest First</Dropdown.Item>
                        <Dropdown.Item href="#/action-2" onClick={() => fetchthumb("1")}>Oldest First</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <div id="scrollinf">
                    <InfiniteScroll
                        pageStart={0}
                        hasMore={false}
                        loader={<div className="loader" key={0}>Loading ...</div>}
                        useWindow={true}
                    >
                    {sug.map((data,idx) => <Image src={`data:image/jpeg;base64,${data}`} id="thumbnail" thumbnail 
                    onClick={() => {traverse(pageid[idx])}} />)}
                    </InfiniteScroll>
                </div>
                </Col>
        </Row>
        </Container>
    )
}
export default Gallery
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
        const response= await axios.post('/currentvid',JSON.stringify(id), {
            headers: {
              'Content-Type': 'application/json'
            },
            responseType: 'blob',
          }
        )
        setVid(URL.createObjectURL(response.data));
    }
    async function fetchthumb(ord){
        const url_='/thumbnail?order='+ord
        const response= await axios.get(url_);
        setSug([...response.data.result])
        setPageid([...response.data.id])
    }
    function traverse(idcurr){
        const path="../gallery/"+idcurr;
        return navigate(path, { replace: true });
    }
    useEffect(() => {
        fetchvid();
        fetchthumb("-1");
    }, [id]);
    
    return (
        <Container fluid style={{maxHeight:"90vh",overflow:"hidden"}}>
        <Row style={{marginTop:"2rem"}}>
            <Col sm={10} style={{marginTop:"1rem"}}>
            <Row><video key={vid} width="480" height="400" controls style={{width:"36rem",margin:"auto"}}><source src={vid} type="video/mp4" /></video></Row>
            <Row><a href={vid} download="artvideo" className="btn btn-light" style={{width:"35rem",margin:"auto"}}>Download</a></Row>
            </Col>
            <Col sm={2}>
                <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic" style={{marginBottom:"0.5rem"}}>Sort Videos By</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1" onClick={() => fetchthumb("-1")}>Newest First</Dropdown.Item>
                        <Dropdown.Item href="#/action-2" onClick={() => fetchthumb("1")}>Oldest First</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <div id="scrollinf">
                    <InfiniteScroll
                        pageStart={0}
                        hasMore={false}
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
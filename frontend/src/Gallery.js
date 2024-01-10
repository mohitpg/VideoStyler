import {useParams} from "react-router-dom"
import { useState,useEffect } from "react";
import axios from "axios"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Button from "react-bootstrap/esm/Button";

function Gallery(){
    const {id} = useParams();
    const [vid,setVid]= useState(null);
    const [sug,setSug] = useState([]);
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
    async function fetchthumb(){
        const response= await axios.get('http://localhost:5000/thumbnail?order=1');
        console.log(response);
        setSug([...response.data.result])
    }
    useEffect(() => {
        fetchvid();
        fetchthumb();
    }, []);
    return (
        <Container fluid>
        <Row style={{marginTop:"2rem"}}>
            <Col sm={10} style={{marginTop:"1rem"}}>
            <Row><video key={vid} width="480" height="400" controls style={{width:"36rem",margin:"auto"}}><source src={vid} type="video/mp4" /></video></Row>
            <Row><a href={vid} download="artvideo" className="btn btn-light" style={{width:"35rem",margin:"auto"}}>Download</a></Row>
            </Col>
            <Col sm={2}>
                <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic">Sort By</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Newest First</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Oldest First</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                {sug.map(data => <img src={`data:image/jpeg;base64,${data}`} style={{width:"20rem",height:"20rem"}}></img>)}
            </Col>
        </Row>
        </Container>
    )
}
export default Gallery
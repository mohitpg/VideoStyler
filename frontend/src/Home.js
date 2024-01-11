import React, { useState, useRef, useEffect } from "react";
import Upload from "./homecomp/Upload";
import Search from "./homecomp/Search";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/esm/Button";
import Spinner from 'react-bootstrap/Spinner';
import axios from "axios"
import "./Home.css"

function Home(){
    const scroll=useRef(null);
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState([]);
    const [enable, setEnable] = useState(0);
    const [enablevid, setEnablevid] = useState(0);
    const [vid, setVid] = useState(null);
    useEffect(() => {
      scroller()
    }, [enable]);
    
    async function handleChange1(e) {
        if (e.target.files.length===1) setFile1(URL.createObjectURL(e.target.files[0]))
        else {setFile1(null);
          setEnable(enable>100?enable-100:enable);
          return;
        }
        const upvid=new FormData();
        upvid.append('video/mp4',e.target.files[0]);
        const response= await axios.post('http://localhost:5000/video',upvid);
        console.log(response);
        setEnable(enable<100?enable+100:enable);
     }
    async function handleChange2(e){
      if (e.target.files.length===1) {
          setFile2([...file2,URL.createObjectURL(e.target.files[0])]);
          setEnable(enable+1);
        }
     }
    async function handleSearch(){
      const id=localStorage.getItem('api');
      const path=await fetch("https://api.artic.edu/api/v1/artworks/"+id+"?fields=image_id");
      const pathval= await path.json();
      let qpath=pathval.config.iiif_url+"/"+pathval.data.image_id+"/full/843,/0/default.jpg";
      const tempimg= await fetch(qpath);
      const currImage= await tempimg.blob();
      setFile2([...file2,URL.createObjectURL(currImage)])
      setEnable(enable+1);
    }
    function scroller(){
      scroll.current?.scrollIntoView({behaviour:"smooth"});
    }
    async function handleSubmit(){
      setEnable(-1000);
      setEnablevid(1);
      const imgs=new FormData();
      for(const data of file2){
        let blob = await fetch(data).then(r => r.blob());
        imgs.append("fil",blob);
      }
      const response= await axios.post('http://localhost:5000/imagess',imgs,{responseType: 'blob'});
      setVid(URL.createObjectURL(response.data));
      setEnablevid(11);
      setEnable(0);
    }
    async function savetodb(){
      const response=await axios.post('http://localhost:5000/cloud');
      console.log(response);
      setEnablevid(1);
    }
    return (
    <Container>
      <Row style={{marginTop:'5%'}}>
        <Col style={{height:'60%'}}><Upload onupload={handleChange1} vid={file1}/></Col>
        <Col style={{height:'60%'}}><Search onupload={handleChange2} onsearch={handleSearch} ondelete={() =>{setEnable(enable>=100?100:0);setFile2([])}} images={file2}/></Col>
      </Row>
      <Row>
        {enable>100?<Button variant="success" id="multibutton" onClick={handleSubmit}>Submit</Button>:enable<0? 
        <div style={{textAlign:"center"}}>
          <Button variant="success" disabled id="multibutton">
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          &nbsp;Please wait...
        </Button>
      </div>: <Button variant="success" disabled id="multibutton">Submit</Button>}
      </Row>
      {enablevid?
      <Row>
        <video key={vid} width="480" height="400" controls id="outvid"><source src={vid} type="video/mp4" /></video>
        {enablevid>10?
        <Row>
          <a href={vid} download="artvideo" className="btn btn-light" id="downloader">Download</a>
          <Button onClick={savetodb} id="saver">Save</Button>
        </Row>
        :<></>}
      </Row>
      :<Row></Row>}
      <div ref={scroll}></div>
    </Container>
      );
}
export default Home;
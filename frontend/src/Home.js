import React, { useState, useRef } from "react";
import Upload from "./homecomp/Upload";
import Search from "./homecomp/Search";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/esm/Button";
import axios from "axios"

function Home(){
    const scroll=useRef(null);
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState([]);
    const [enable, setEnable] = useState(0);
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
    async function handleSubmit(){
      const imgs=new FormData();
      // let blob1 = await fetch(file2[0]).then(r => r.blob());
      // let blob2 = await fetch(file2[1]).then(r => r.blob());
      // temp.append("abc",blob1);
      // temp.append("abc",blob2);
      for(const data of file2){
        let blob = await fetch(data).then(r => r.blob());
        imgs.append("fil",blob);
      }
      const response= await axios.post('http://localhost:5000/imagess',imgs);
      console.log(response);
    }
    return (
    <Container>
      <Row style={{marginTop:'5%'}}>
        <Col style={{height:'60%'}}><Upload onupload={handleChange1} vid={file1}/></Col>
        <Col style={{height:'60%'}}><Search onupload={handleChange2} onsearch={handleSearch} images={file2}/></Col>
      </Row>
      <Row>
        {enable>100?<Button variant="success" style={{margin:'2% auto 0px auto',width:"20%"}} onClick={handleSubmit}>Submit</Button>:
        <Button variant="success" disabled style={{margin:'2% auto 0px auto',width:"20%"}}>Submit</Button>}
      </Row>
      <Row>

      </Row>
      <div ref={scroll}></div>
    </Container>
      );
}
export default Home;
import React, { useState, useRef } from "react";
import Upload from "./homecomp/Upload";
import Search from "./homecomp/Search";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import uploadimg from "./upload.jpg"
import Button from "react-bootstrap/esm/Button";

function Home(){
    const scroll=useRef(null);
    const [file1, setFile1] = useState(uploadimg);
    const [file2, setFile2] = useState(uploadimg);
    const [enable, setEnable] = useState(0);
    function handleChange1(e) {
        (e.target.files.length===1)?setFile1(URL.createObjectURL(e.target.files[0])):setFile1(uploadimg);
        setEnable(enable+1);
     }
    function handleChange2(e) {
      (e.target.files.length===1)?setFile2(URL.createObjectURL(e.target.files[0])):setFile2(uploadimg);
      setEnable(enable+1);
     }
    async function handleSearch(){
      const id=localStorage.getItem('api');
      const path=await fetch("https://api.artic.edu/api/v1/artworks/"+id+"?fields=image_id");
      const pathval= await path.json();
      let qpath=pathval.config.iiif_url+"/"+pathval.data.image_id+"/full/843,/0/default.jpg";
      const tempimg= await fetch(qpath);
      const currImage= await tempimg.blob();
      setFile2(URL.createObjectURL(currImage));
      setEnable(enable+1);
    }
    return (
    <Container>
      <Row style={{marginTop:'5%'}}>
        <Col style={{height:'60%'}}><Upload onupload={handleChange1} image={file1}/></Col>
        <Col style={{height:'60%'}}><Search onupload={handleChange2} onsearch={handleSearch} image={file2}/></Col>
      </Row>
      <Row>
        {enable>1?<Button variant="success" style={{margin:'2% auto 0px auto',width:"20%"}}>Submit</Button>:
        <Button variant="success" disabled style={{margin:'2% auto 0px auto',width:"20%"}}>Submit</Button>}
      </Row>
      <Row>

      </Row>
      <div ref={scroll}></div>
    </Container>
      );
}
export default Home;
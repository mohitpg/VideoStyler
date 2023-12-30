import React, { useState } from "react";
import Upload from "./homecomp/Upload";
import Search from "./homecomp/Search";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import uploadimg from "./upload.jpg"

function Home(){
    const [file1, setFile1] = useState(uploadimg);
    const [file2, setFile2] = useState(uploadimg);
    function handleChange1(e) {
        (e.target.files.length===1)?setFile1(URL.createObjectURL(e.target.files[0])):setFile1(uploadimg);
     }
    function handleChange2(e) {
      (e.target.files.length===1)?setFile2(URL.createObjectURL(e.target.files[0])):setFile2(uploadimg);
     }
    async function handleSearch(){
      const id=localStorage.getItem('api');
      const path=await fetch("https://api.artic.edu/api/v1/artworks/"+id+"?fields=image_id");
      const pathval= await path.json();
      let qpath=pathval.config.iiif_url+"/"+pathval.data.image_id+"/full/843,/0/default.jpg";
      const tempimg= await fetch(qpath);
      const currImage= await tempimg.blob();
      setFile2(URL.createObjectURL(currImage));
    }
    return (
    <Container>
      <Row style={{marginTop:'5%'}}>
        <Col style={{height:'60%'}}><Upload onupload={handleChange1} image={file1}/></Col>
        <Col style={{height:'60%'}}><Search onupload={handleChange2} onsearch={handleSearch} image={file2}/></Col>
      </Row>
    </Container>
      );
}
export default Home;
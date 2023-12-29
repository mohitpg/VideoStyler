import React, { useState } from "react";
import Upload from "./homecomp/Upload";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import uploadimg from "./upload.jpg"

function Home(){
    const [file, setFile] = useState(uploadimg);
    function handleChange(e) {
        console.log(e.target.files.length);
        (e.target.files.length===1)?setFile(URL.createObjectURL(e.target.files[0])):setFile(uploadimg);
     }
    return (
    <Container>
      <Row style={{marginTop:'5%'}}>
        <Col style={{height:'60%'}}><Upload onupload={handleChange} image={file}/></Col>
        <Col>2 of 2</Col>
      </Row>
    </Container>
      );
}
export default Home;
import "./Search.css"
import { useState } from "react";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Search (props){
    const [search,setSearch]=useState("");
    function uploadHandler(e){
      props.onupload(e);
    }
    async function changeHandler(e){
      let qparam=e.target.value;
      setSearch(e.target.value);
      qparam=qparam.replace(/ /g,'%20');
      let finparam="https://api.artic.edu/api/v1/artworks/search?q="+qparam+"&limit=5&fields=title";
      const res= await fetch(finparam);
      const apival= await res.json();
    }
    return (
        <Card className="text-white" id="cardm">
          <Card.Img variant="top" src={props.image} id="cardimg"/>
          <Card.Body>
            <Card.Title id="cardtitle1">Upload the image to be converted!</Card.Title>
            <Form >
                <input type="file" name="imageinput" onChange={uploadHandler} />
            </Form>
            <Card.Title id="cardtitle1">Or</Card.Title>
            <Card.Title id="cardtitle1">Search an art piece</Card.Title>
            <Form>
              <Row>
                <Col xs={10}>
                  <Form.Control value={search} onChange={changeHandler} placeholder='Search "Starry nights" ' id='sform' />
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
    );
}
export default Search;
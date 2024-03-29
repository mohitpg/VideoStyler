import "./Search.css"
import { useState } from "react";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';
import Render from "./Render";

function Search (props){
    const [search,setSearch]=useState("");
    const [buttonval,setButtonval]=useState([]);
    function stopper(e){
      e.preventDefault();
    }
    function uploadHandler(e){
      props.onupload(e);
    }
    function clickHandler(id){
      console.log(id);
      localStorage.setItem("api",id);
      setSearch("");
      setButtonval([]);
      props.onsearch();
    }
    async function changeHandler(e){
      let qparam=e.target.value;
      setSearch(e.target.value);
      if(!e.target.value || search===""){
        setButtonval([]);
        return;
      }
      qparam=qparam.replace(/ /g,'%20');
      let finparam="https://api.artic.edu/api/v1/artworks/search?q="+qparam+"&limit=3&fields=title,id";
      const res= await fetch(finparam);
      const apival= await res.json();
      setButtonval(apival.data)
    }
    return (
        <Card className="text-white" id="cardm">
          <Carousel slide={false}>
            {props.images.toReversed().map((data,it) =>
            <Carousel.Item style={{height:"14rem",width:"25rem"}} key={it}>
              <img src={data}  style={{height:"14rem",width:"25rem",margin:"auto"}} key={it}/>
            </Carousel.Item>)}
          </Carousel>
          <Card.Body>
            <Card.Title id="cardtitle1">Upload the style images</Card.Title>
            <Form >
                <Row>
                  <Col>
                    <input type="file" name="imageinput" onChange={uploadHandler} style={{}}/>
                  </Col>
                  <Col>
                    <button onClick={(e) =>{e.preventDefault();props.ondelete();}}>X</button>
                  </Col>
                </Row>
            </Form>
            <Card.Title id="cardtitle1" style={{textAlign:'center'}}>Or</Card.Title>
            <Card.Title id="cardtitle1">Search an art piece</Card.Title>
            <Form>
              <Row>
                <Col xs={12}>
                  <Form.Control value={search} onChange={changeHandler} onSubmit={stopper} placeholder='Search "Starry nights" '
                   id='sform' style={{borderRadius:'0%'}} autoComplete="off"/>
                </Col>
              </Row>
              {buttonval.map(data => <Render val={data} onclick={clickHandler} />)}
            </Form>
          </Card.Body>
        </Card>
    );
}
export default Search;
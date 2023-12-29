import "./Search.css"
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

function Search (props){
    function uploadHandler(e){
        props.onupload(e);
    }
    return (
        <Card className="text-white" id="cardm">
          <Card.Img variant="top" src={props.image} id="cardimg"/>
          <Card.Body>
            <Card.Title id="cardtitle">Upload the image to be converted!</Card.Title>
            <Form >
                <input type="file" name="imageinput" onChange={uploadHandler} />
            </Form>
          </Card.Body>
        </Card>
    );
}
export default Search;
import "./Upload.css"
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

function Upload (props){
    function uploadHandler(e){
        props.onupload(e);
    }
    return (
        <Card className="text-white" id="cardm">
          <video key={props.vid} width="360" height="220" controls style={{margin:"auto auto auto auto"}}>
            <source src={props.vid} type="video/mp4" />
          </video>
          <Card.Body>
            <Card.Title id="cardtitle">Upload the video to be converted!</Card.Title>
            <Form >
                <input type="file" name="imageinput" onChange={uploadHandler} />
            </Form>
          </Card.Body>
        </Card>
    );
}
export default Upload;
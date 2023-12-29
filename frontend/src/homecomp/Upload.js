import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

function Upload (props){
    function uploadHandler(e){
        props.onupload(e);
    }
    return (
        <Card style={{ width: '20%' }}>
          <Card.Img variant="top" src={props.image}/>
          <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Form >
                <input type="file" name="imageinput" onChange={uploadHandler} style={{margin:'1px -10% 1px auto'}}/>
            </Form>
          </Card.Body>
        </Card>
    );
}
export default Upload;
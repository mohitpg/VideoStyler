import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'

function Render(props){
    function subclickhandler(){
        props.onclick(props.val.id);
    }
    return(
        <Row>
            <Col xs={10}>
                <Button variant='light' style={{fontSize:'0.75rem',width:'100%',textAlign:'left',borderRadius:"0%"}}
                onClick={subclickhandler}>{props.val.title}</Button>
            </Col>
        </Row>
    )
}

export default Render;
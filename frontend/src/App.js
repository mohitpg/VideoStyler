import './App.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Home from './Home';
import Gallery from './Gallery';
import { Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Navbar style={{background:"transparent"}}>
        <Container >
          <Nav className="mx-auto">
            <Navbar.Brand><Link to="/" id="home">Home</Link></Navbar.Brand>
            <Navbar.Brand><Link to="/gallery/random" id='gallery'>Your collections</Link></Navbar.Brand>
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/gallery/:id" element={<Gallery />}></Route>
      </Routes>
    </div>
  );
}

export default App;

import {useParams} from "react-router-dom"
import { useState,useEffect } from "react";
import axios from "axios"
function Gallery(){
    const {id} = useParams();
    const [vid,setVid]= useState(null);
    async function fetchvid(){
        const response= await axios.post('http://localhost:5000/currentvid',JSON.stringify(id), {
            headers: {
              'Content-Type': 'application/json'
            },
            responseType: 'blob',
          }
        )
        setVid(URL.createObjectURL(response.data));
    }
    useEffect(() => {
        fetchvid();
    }, []);
    return <video key={vid} width="480" height="400" controls ><source src={vid} type="video/mp4" /></video>;
}
export default Gallery
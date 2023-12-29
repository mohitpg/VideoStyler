import React, { useState } from "react";
import Upload from "./homecomp/Upload";
import uploadimg from "./upload.jpg"

function Home(){
    const [file, setFile] = useState(uploadimg);
    function handleChange(e) {
        console.log(e.target.files.length);
        (e.target.files.length===1)?setFile(URL.createObjectURL(e.target.files[0])):setFile(uploadimg);
     }
    return (
        <Upload onupload={handleChange} image={file}/>
      );
}
export default Home;
import { React, useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

import Container from "@mui/material/Container";
import MenuAppBar from "./components/AppBar.js";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";

import Copyright from "./components/Copyright";

import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";

import { useAuth } from "./Auth.js";
import { Link as RouterLink } from "react-router-dom";

import './App.css';

const modal_style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {


  //<p>You are not logged in.</p><p><strong>Please log in to save your changes</strong></p>
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [tinyApiKey, setTinyApiKey] = useState("");
  const [tinyBusy, setTinyBusy] = useState(true);

  const [cookies, setCookie] = useCookies(["TOKEN_PAYLOAD"]);

  const editorRef = useRef(null);

  const auth = useAuth();

  const handleEditorChange = (content, editor) => {
    setContent(content);
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSaveClick = () => {
    // console.log("content " + content);

    if(auth.authed){
      var id = localStorage.getItem("userid");
      var save_url = "/api/users/" + id + "/updatenotepad";
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        notepad : content
      });
      var requestOptions = {
          method : "POST",
          headers : myHeaders,
          body : raw
      }

      fetch(save_url, requestOptions)
        .catch(err => console.log(err));
    } else {
      setOpen(true);
    }

  }

  //componentdidmount
  useEffect(() => {
    if(auth.authed){
      var id = localStorage.getItem("userid");
      var url = "/api/users/" + id;
      var myHeaders = new Headers();
      var requestOptions = {
          method : "GET",
          headers : myHeaders,
      }

      // console.log(jwt_decode(cookies.TOKEN_PAYLOAD).username);
      setUsername(jwt_decode(cookies.TOKEN_PAYLOAD).username);
      fetch(url, requestOptions)
        .then(res => res.json())
        .then(data => {
          // console.log(data);
          setContent(data.user.notepad);
        })
        .catch(err => console.log(err));
    }
  }, []);

  useEffect(() => {
    var url = "/api/tinyapi";
    fetch(url)
      .then(res => res.json())
      .then(data => {
        // console.log("tiny key " + data.apiKey);
        setTinyApiKey(data.apiKey);
        setTinyBusy(false);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="app">
      <MenuAppBar />
        <Container sx={{display : "flex",
          alignItems : "center",
          flexDirection : "column"}}>
          {/* <TextField
            id="outlined-textarea"
            label="Notepad"
            placeholder="Type notes here"
            multiline
            fullWidth
            minRows={20}
            sx={{
              marginTop : 3
            }}>
              
          </TextField> */}

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modal_style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Not logged in!
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Please <Link component={RouterLink} to="/login">log in</Link> to save your notepad.
              </Typography>
            </Box>
          </Modal>
          

          <Box sx={{marginTop : 1}} className={loading ? "main-content-invisible" : ""}>
            <Box sx={{display : "flex", flexDirection : "row"}}>
              <Button
                variant="contained"
                sx={{m:1}}
                onClick={handleSaveClick}
              >
                Save
              </Button>
              <Typography sx={{paddingBottom : 1.7, paddingTop : 1.7}} className={auth.authed ? "main-content-invisible" : ""}>
                You are not currently logged in! <Link component={RouterLink} to="/login">Log in</Link> to save your notepad.
              </Typography>
            </Box>
            {!tinyBusy && (<Editor
              apiKey={tinyApiKey}
              onInit={(evt, editor) => editorRef.current = editor}
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  'lists', 'advlist', 'autolink', 'link', 'image', 'charmap', 'preview', 'anchor',
                  // "searchreplace", "visualblocks", "code", "fullscreen",
                  // "insertdatetime", "media", "table", "code", "help", "wordcount"
                  // 'lists advlist autolink link image charmap print preview anchor',
                  // 'searchreplace visualblocks code fullscreen',
                  // 'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                setup : function(editor){
                  editor.on('init', function() {
                    // console.log("DONE");
                    setLoading(false);
                  });
                }
                }}
              value={content}
              onEditorChange={handleEditorChange}
            />)}
            {/* <button onClick={log}>Log editor content</button> */}
            <Box sx={{paddingTop : 5}}>
              <Copyright />
            </Box>
          </Box>
        </Container>
    </div>
  );
}

export default App;

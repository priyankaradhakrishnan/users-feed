import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Icon from "@mui/material/Icon";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";
import { BASE_API_URL } from "../constants/constants";
import Stack from "@mui/material/Stack";

function UserList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [comments, setComments] = useState([]);

  const style = {
    width: "100%",
    maxWidth: 560,
    bgcolor: "background.paper",
  };
  useEffect(() => {
    // fetch users data
    fetch(BASE_API_URL + "/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    // fetch posts for selected user
    if (selectedUser) {
      fetch(BASE_API_URL + `/posts?userId=${selectedUser.id}`)
        .then((response) => response.json())
        .then((data) => setPosts(data))
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedUser]);

  function handleUserSelect(user) {
    setSelectedUser(user);
  }

  function handleLoadAllPosts() {
    setShowAllPosts(true);
  }

  function handleExpandPost(post) {
    setExpandedPost(post);
    fetch(BASE_API_URL + `/comments?postId=${post.id}`)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error("Error:", error));
  }

  return (
    <Container maxWidth="l">
      <Typography variant="h3" component="h3">
        Users
      </Typography>
      <Typography>
        Please select a user to find their posts & comments:
      </Typography>
      <Divider style={{ margin: 20 }} />
      {users.length === 0 && <p>Loading users...</p>}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        {users.map((user) => (
          <>
            {" "}
            <Button
              variant="contained"
              key={user.id}
              sx={{
                backgroundColor:
                  selectedUser === user ? "orange" : "primary.dark",
                color: selectedUser === user ? "primary.dark" : "white",
                "&:hover": {
                  backgroundColor: "orange",
                },
              }}
              onClick={() => handleUserSelect(user)}
            >
              {user.name.replace(". ", "").split(" ")[0]}
            </Button>
          </>
        ))}
      </Stack>
      {selectedUser && (
        <Box>
          <h2>{selectedUser.name}'s Posts</h2>
          {posts.slice(0, showAllPosts ? posts.length : 3).map((post) => (
            <Box>
              <Card
                sx={{
                  border: "1px dashed blue",
                  width: 500,
                  minWidth: 275,
                  height: 200,
                  backgroundColor: "primary.main",
                  color: "white",
                }}
                key={post.id}
              >
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {post.title}
                  </Typography>
                  <p>{post.body}</p>
                </CardContent>
              </Card>
              {expandedPost === "" && <p>Loading...</p>}
              {expandedPost === post ? (
                <div>
                  <Typography variant="h5" component="h2">
                    Comments
                  </Typography>
                  {comments.length === 0 && <p>Loading comments...</p>}
                  {comments.length > 0 &&
                    comments.map((comment) => (
                      <>
                        <List
                          sx={style}
                          component="nav"
                          aria-label="mailbox folders"
                          key={comment.id}
                        >
                          <ListItemButton>
                            <ListItemText>
                              {" "}
                              <Typography variant="subtitle2">
                                {comment.name}
                              </Typography>
                              <Typography variant="body2">
                                {" "}
                                {comment.body}
                              </Typography>
                            </ListItemText>
                          </ListItemButton>
                          <Divider />
                        </List>
                      </>
                    ))}
                </div>
              ) : (
                <Button onClick={() => handleExpandPost(post)} alt="expand">
                  Comments <Icon>add_circle</Icon>
                </Button>
              )}
            </Box>
          ))}
          {!showAllPosts && posts.length > 3 && (
            <Button onClick={handleLoadAllPosts}>Load All</Button>
          )}
        </Box>
      )}
    </Container>
  );
}

export default UserList;

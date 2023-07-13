import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const [keyword, setKeyword] = useState();
  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault;
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate(`/`);
    }
  };
  return (
    <>
      <Form className="d-flex m-auto" onSubmit={submitHandler}>
        <Form.Control
          type="text"
          name="q"
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search"
          className="me-2"
          aria-label="Search"
        />
        <Button type="submit" variant="outline-success">
          Search
        </Button>
      </Form>
    </>
  );
};

export default SearchBox;

import styled from "styled-components";
import { StyledButton } from "./StyledButton.js";
import useSWR from "swr";
import { useRouter } from "next/router.js";

const FormContainer = styled.form`
  display: grid;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: inherit;
  border: 3px solid black;
  border-radius: 0.5rem;
`;

const Textarea = styled.textarea`
  font-family: inherit;
  border: 3px solid black;
  border-radius: 0.5rem;
  padding: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
`;

export default function Form({ formName, defaultData }) {
  const places = useSWR("/api/places");
  const router = useRouter();
  const { push } = router;
  const { id } = router.query;

  async function handleAdd(event, data) {
    const response = await fetch("/api/places", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      await response.json();
      places.mutate();
      event.target.reset();
      push("/");
    } else {
      console.error(`"Error: ${response.status}`);
    }
  }

  async function handleEdit(event, data) {
    const response = await fetch(`/api/places/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      await response.json();
      places.mutate();
      event.target.reset();
      push("/");
    } else {
      console.error(`"Error: ${response.status}`);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    //onSubmit(data);

    {
      formName === "edit-place"
        ? handleEdit(event, data)
        : handleAdd(event, data);
    }
  }

  return (
    <FormContainer aria-labelledby={formName} onSubmit={handleSubmit}>
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        name="name"
        type="text"
        defaultValue={defaultData?.name}
      />
      <Label htmlFor="image-url">Image Url</Label>
      <Input
        id="image-url"
        name="image"
        type="text"
        defaultValue={defaultData?.image}
      />
      <Label htmlFor="location">Location</Label>
      <Input
        id="location"
        name="location"
        type="text"
        defaultValue={defaultData?.location}
      />
      <Label htmlFor="map-url">Map Url</Label>
      <Input
        id="map-url"
        name="mapURL"
        type="text"
        defaultValue={defaultData?.mapURL}
      />
      <Label htmlFor="description">Description</Label>
      <Textarea
        name="description"
        id="description"
        cols="30"
        rows="10"
        defaultValue={defaultData?.description}
      ></Textarea>
      <StyledButton type="submit">
        {defaultData ? "Update place" : "Add place"}
      </StyledButton>
    </FormContainer>
  );
}

const axios = require("axios");

const getRequest = async () => {
  try {
    // const url = "http://localhost:3000/data";
    const url = "http://localhost:50291/text";
    const response = await axios.get(url);
    console.log(response.data);
  } catch (error) {
    console.error(error?.response?.data || error);
  }
};
const postRequest = async () => {
  try {
    // const url = "http://localhost:3000/text";
    const url = "http://localhost:50291/text";
    const response = await axios.post(url, {
      text: "Hello from the client!",
    });
    console.log(response.data);
  } catch (error) {
    console.error(error?.response?.data || error);
  }
};

postRequest();
getRequest();

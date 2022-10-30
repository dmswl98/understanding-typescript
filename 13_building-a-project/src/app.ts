import axios from "axios";

const $form = document.querySelector("form")!;
const $addressInput = document.getElementById("address")! as HTMLInputElement;

const GOOGLE_API_KEY = "AIzaSyArSey3Tt69EZljOkzjzq5eZ7QnTf_goVE";

// declare var google: any;

function searchAddressHandler(e: Event) {
  e.preventDefault();
  const enteredAddress = $addressInput.value;

  type GoogleGeocodingResponse = {
    results: { geometry: { location: { lat: number; lng: number } } }[];
    status: "OK" | "ZERO_RESULTS";
  };

  // 구글 api 호출
  // encodeURI : 입력받은 문자열을 URL에서 호환가능한 문자열로 반환
  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}`
    )
    .then((res) => {
      if (res.data.status !== "OK") {
        throw new Error("Could not fetch location");
      }
      const coordinates = res.data.results[0].geometry.location;
      console.log(coordinates);
      const map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: coordinates,
          zoom: 15,
        }
      );
      new google.maps.Marker({ position: coordinates, map: map });
    })
    .catch((err) => {
      console.log(err.message);
    });
}

$form?.addEventListener("submit", searchAddressHandler);

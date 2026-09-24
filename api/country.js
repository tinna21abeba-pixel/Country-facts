export default async function handler(req, res) {

  /* =========================================
     GET COUNTRY NAME
  ========================================= */

  const { name } = req.query;


  if (!name) {

    return res.status(400).json({
      error: "Country name is required."
    });

  }


  try {

    /* =========================================
       REST COUNTRIES API URL
    ========================================= */

    const url =
      `https://restcountries.com/v3.1/name/${encodeURIComponent(
        name
      )}`;


    console.log(
      "Requesting country:",
      name
    );


    /* =========================================
       CALL REST COUNTRIES
    ========================================= */

    const response = await fetch(url);


    /* =========================================
       GET JSON
    ========================================= */

    const data =
      await response.json();


    /* =========================================
       CHECK API RESPONSE
    ========================================= */

    if (!response.ok) {

      console.error(
        "REST Countries error:",
        data
      );


      return res.status(
        response.status
      ).json({
        error:
          data?.errors?.[0]?.message ||
          "REST Countries API request failed."
      });

    }


    /* =========================================
       SEND DATA TO FRONTEND
    ========================================= */

    return res.status(200).json(
      data
    );


  } catch (error) {

    console.error(
      "Server API error:",
      error
    );


    return res.status(500).json({
      error:
        "Unable to connect to REST Countries API."
    });

  }

}
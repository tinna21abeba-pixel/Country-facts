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

    const API_KEY =
      process.env.REST_COUNTRIES_API_KEY ||
      "rc_live_7dd3840ff4004c8abedb2457f49d46de";


    /* =========================================
       REST COUNTRIES API URL
    ========================================= */

    const url =
      `https://api.restcountries.com/countries/v5?q=${encodeURIComponent(
        name
      )}&api-key=${encodeURIComponent(API_KEY)}`;


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

    if (data?.success === false || data?.errors?.length) {
      return res.status(502).json({
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
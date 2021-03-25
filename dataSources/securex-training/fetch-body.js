/**
 * Construct the request body for fetching SecureX Training events.
 * @return {String}
 */
module.exports = (key) => {
  var details = {
    message: JSON.stringify({
      actions: [
        {
          id: "1200;a",
          descriptor:
            "apex://SVNSUMMITS_EventListController/ACTION$getEventsList",
          callingDescriptor: "markup://c:SVNSUMMITS_Events_List",
          params: {
            compactMode: false,
            listSize: 12,
            sortBy: "Upcoming",
            filterByTopic: "0TO3i00000092erGAA",
            filterOn: "None",
            fromDate: "",
            toDate: "",
            listViewMode: "List",
            customFields: "",
            filters: "Upcoming_Event__c:Yes;",
            isPrivate: true,
          },
        },
      ],
    }),
    "aura.context": JSON.stringify({
      mode: "PROD",
      fwuid: key,
      app: "siteforce:communityApp",
      loaded: {
        "APPLICATION@markup://siteforce:communityApp": "fV3Zo7mI3PLrr1VMsCPF3w",
      },
      dn: [],
      globals: {},
      uad: false,
    }),
    "aura.token": "undefined",
  };

  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }

  formBody = formBody.join("&");

  return formBody;
};

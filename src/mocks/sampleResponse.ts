export const sampleResponse = {
  response: {
    tables: [
      {
        headers: ["From", "To", "By", "ETD", "ETA"],
        rows: [
          {
            "From": "118 Queen Street Hoboken, NJ 07030",
            "To": "52 West Trenton St. Harleysville, PA 19438",
            "By": "cause science slow",
            "ETD": "09-Dec-2018 19:00",
            "ETA": "09-Dec-2020 11:00"
          },
          {
            "From": "9 Ketch Harbour Ave. Vincentown, NJ",
            "To": "75 Fawn Street Peabody, MA 01960",
            "By": "tone late spoken",
            "ETD": "12-Dec-2018 10:00",
            "ETA": "19-Dec-2020"
          }
        ],
        meta: {
          columnCount: 5,
          rowCount: 3
        }
      },
      {
        headers: ["Deadline", "Location", "Date/Time (local)", "Required action"],
        rows: [
          {
            "Deadline": "Table",
            "Location": "Harleysville (PA)",
            "Date/Time (local)": "08-Dec-2019",
            "Required action": ""
          },
          {
            "Deadline": "Flight",
            "Location": "Harleysville (PA)",
            "Date/Time (local)": "08-Dec-2019 13:00",
            "Required action": "Two more days and all his problems would be solved."
          },
          {
            "Deadline": "Round",
            "Location": "Harleysville (PA)",
            "Date/Time (local)": "09-Dec-2019",
            "Required action": ""
          },
          {
            "Deadline": "Accent",
            "Location": "Harleysville (PA)",
            "Date/Time (local)": "10-Dec-2019",
            "Required action": ""
          },
          {
            "Deadline": "Monkey",
            "Location": "Harleysville (PA)",
            "Date/Time (local)": "11-Dec-2019",
            "Required action": ""
          },
          {
            "Deadline": "Route",
            "Location": "Harleysville (PA)",
            "Date/Time (local)": "11-Dec-2019",
            "Required action": "Peanuts don't grow on trees."
          }
        ],
        meta: {
          columnCount: 4,
          rowCount: 7
        }
      }
    ],
    paragraphs: [] // We can add paragraphs if needed
  }
};
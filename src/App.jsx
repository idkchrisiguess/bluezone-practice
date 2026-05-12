import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function App() {

  const screens = [

    {
      id: "named-insured",
      title: "PL PROP - NAMED INSURED",
      sections: [
        {
          heading: "ACCOUNT INFORMATION",
          fields: [
            "Agency",
            "Office Number",
            "State",
            "Line County",
            "Policy Number",
            "Named Insured",
            "Payor Version",
            "Effective Date",
            "Policy Term"
          ]
        },

        {
          heading: "BILLING INFORMATION",
          fields: [
            "Bill Number",
            "Bill Status",
            "Level",
            "Bill Plan",
            "Farm Type",
            "Risk State",
            "Policy Form",
            "Policy Type",
            "Policy Status"
          ]
        },

        {
          heading: "PROPERTY INFORMATION",
          fields: [
            "Zip",
            "City",
            "Occupation",
            "Number of Stories",
            "Construction Type",
            "Protection Class",
            "Year Built",
            "Roof Type"
          ]
        }
      ]
    },

    {
      id: "locations",
      title: "PL PROP - LOCATIONS",

      sections: [
        {
          heading: "LOCATION INFORMATION",

          rows: [

            [
              "Location 1",
              "County 1",
              "State 1",
              "Lienholder 1"
            ],

            [
              "Tax Location 1",
              "Record Date 1",
              "Zip 1",
              ""
            ],

            [
              "Location 2",
              "County 2",
              "State 2",
              "Lienholder 2"
            ],

            [
              "Tax Location 2",
              "Record Date 2",
              "Zip 2",
              ""
            ],

            [
              "Location 3",
              "County 3",
              "State 3",
              "Lienholder 3"
            ],

            [
              "Tax Location 3",
              "Record Date 3",
              "Zip 3",
              ""
            ],

            [
              "Location 4",
              "County 4",
              "State 4",
              "Lienholder 4"
            ],

            [
              "Tax Location 4",
              "Record Date 4",
              "Zip 4",
              ""
            ]

          ]
        }
      ]
    },

    {
      id: "liens",
      title: "PL PROP - LIENS",
      sections: [
        {
          heading: "LIEN INFORMATION",
          fields: [
            "Policy Status",
            "Lienholder Type 1",
            "Pay Receipt 1",
            "EOI 1",
            "Record Date 1",
            "Lienholder ID 1",
            "Loan Number 1",
            "Undivided Interest 1",
            "Name 1",
            "Address 1",
            "City 1",
            "State 1",
            "Zip 1",
            "Lienholder Type 2",
            "Pay Receipt 2",
            "EOI 2",
            "Record Date 2",
            "Lienholder ID 2",
            "Loan Number 2",
            "Undivided Interest 2",
            "Name 2",
            "Address 2",
            "City 2",
            "State 2",
            "Zip 2"
          ]
        }
      ]
    },

    {
      id: "descriptions",
      title: "PL PROP - DESCRIPTIONS",
      sections: [
        {
          heading: "COVERAGE DESCRIPTIONS",
          fields: [
            "Item",
            "Code",
            "Location",
            "Description",
            "Type",
            "Limit",
            "Deductible",
            "Premium",
            "Special Form",
            "Wind Hail Exclusion",
            "Liability Level"
          ]
        }
      ]
    },

    {
      id: "description-index",
      title: "PL PROP DESCRIPTION INDEX",
      sections: [
        {
          heading: "INDEX",
          fields: [
            "Item Left",
            "Property Code Left",
            "Description Left",
            "Item Right",
            "Property Code Right",
            "Description Right"
          ]
        }
      ]
    },

    {
      id: "footnotes",
      title: "PL PROP - FOOTNOTES",
      sections: [
        {
          heading: "FOOTNOTE RECORDS",
          fields: [
            "Sequence 1",
            "Type 1",
            "Application Date 1",
            "Code 1",
            "Message 1",
            "Sequence 2",
            "Type 2",
            "Application Date 2",
            "Code 2",
            "Message 2",
            "Sequence 3",
            "Type 3",
            "Application Date 3",
            "Code 3",
            "Message 3"
          ]
        }
      ]
    },

    {
      id: "endorsements",
      title: "PL PROP POLICY ENDORSEMENTS",
      sections: [
        {
          heading: "ENDORSEMENTS",
          fields: [
            "Item",
            "Description"
          ]
        }
      ]
    }

  ];

  const [currentScreen, setCurrentScreen] = React.useState(0);
  const [sessionName, setSessionName] = React.useState("");
  const [entries, setEntries] = React.useState({});
  const [savedSessions, setSavedSessions] = React.useState([]);

  React.useEffect(() => {

    const stored =
      localStorage.getItem(
        "bluezone-practice-sessions"
      );

    if (stored) {
      setSavedSessions(JSON.parse(stored));
    }

  }, []);

  const handleChange = (field, value) => {

    const screenId =
      screens[currentScreen].id;

    setEntries((prev) => ({
      ...prev,

      [screenId]: {
        ...prev[screenId],
        [field]: value
      }
    }));
  };

  const saveSession = () => {

  const session = {

    id: Date.now(),

    trainee:
      sessionName || "Unnamed Trainee",

    timestamp:
      new Date().toLocaleString(),

    responses: entries

  };

  const updated = [
    ...savedSessions,
    session
  ];

  setSavedSessions(updated);

  localStorage.setItem(
    "bluezone-practice-sessions",
    JSON.stringify(updated)
  );

  alert("Training session saved.");

  // Clear all form entries
  setEntries({});

  // Return to first screen
  setCurrentScreen(0);

};

  const exportToExcel = () => {

  const workbook =
    XLSX.utils.book_new();

  savedSessions.forEach((session, index) => {

    const rows = [];

    Object.entries(session.responses)
      .forEach(([screen, fields]) => {

        Object.entries(fields)
          .forEach(([field, value]) => {

            rows.push({
              Screen: screen,
              Field: field,
              Entry: value,
              Timestamp: session.timestamp,
              Trainee: session.trainee
            });

          });

      });

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    const safeSheetName =
      `${session.trainee}_${index + 1}`
        .substring(0, 31);

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      safeSheetName
    );

  });

  XLSX.writeFile(
    workbook,
    "BlueZoneTrainingRecords.xlsx"
  );

};

  const current =
    screens[currentScreen];

  return (

    <div style={pageStyle}>

      <div style={containerStyle}>

        <div style={headerStyle}>

          <h1>
            BLUEZONE PRACTICE
          </h1>

          <div style={buttonContainerStyle}>

            <button
              onClick={saveSession}
              style={buttonStyle}
            >
              SAVE SESSION
            </button>

            <button
              onClick={exportToExcel}
              style={buttonStyle}
            >
              EXPORT EXCEL
            </button>

          </div>

        </div>

        <div style={{ marginBottom: "20px" }}>

          <div style={{ marginBottom: "8px" }}>
            TRAINEE NAME
          </div>

          <input
            type="text"
            value={sessionName}
            onChange={(e) =>
              setSessionName(e.target.value)
            }
            style={mainInputStyle}
          />

        </div>

        <div style={windowStyle}>

          <div style={titleBarStyle}>

            <div>
              {current.title}
            </div>

            <div>
              SCREEN {currentScreen + 1}
              {" / "}
              {screens.length}
            </div>

          </div>

          {current.sections.map((section) => (

            <div
              key={section.heading}
              style={sectionStyle}
            >

              <div style={sectionHeadingStyle}>
                {section.heading}
              </div>

              {section.rows ? (

                section.rows.map(
                  (row, rowIndex) => (

                    <div
                      key={rowIndex}
                      style={locationRowStyle}
                    >

                      {row.map((field) => (

                        field ? (

                          <div
                            key={field}
                          >

                            <div
                              style={smallLabelStyle}
                            >
                              {field}
                            </div>

                            <input
                              type="text"
                              value={
                                entries[current.id]?.[
                                  field
                                ] || ""
                              }

                              onChange={(e) =>
                                handleChange(
                                  field,
                                  e.target.value
                                )
                              }

                              style={fieldInputStyle}
                            />

                          </div>

                        ) : (
                          <div key={Math.random()} />
                        )

                      ))}

                    </div>

                  )
                )

              ) : (

                <div style={twoColumnStyle}>

                  <div>

                    {section.fields
                      .slice(
                        0,
                        Math.ceil(
                          section.fields.length / 2
                        )
                      )
                      .map((field) => (

                        <div
                          key={field}
                          style={rowStyle}
                        >

                          <label
                            style={labelStyle}
                          >
                            {field}
                          </label>

                          <input
                            type="text"
                            value={
                              entries[current.id]?.[
                                field
                              ] || ""
                            }

                            onChange={(e) =>
                              handleChange(
                                field,
                                e.target.value
                              )
                            }

                            style={fieldInputStyle}
                          />

                        </div>

                      ))}

                  </div>

                  <div>

                    {section.fields
                      .slice(
                        Math.ceil(
                          section.fields.length / 2
                        )
                      )
                      .map((field) => (

                        <div
                          key={field}
                          style={rowStyle}
                        >

                          <label
                            style={labelStyle}
                          >
                            {field}
                          </label>

                          <input
                            type="text"
                            value={
                              entries[current.id]?.[
                                field
                              ] || ""
                            }

                            onChange={(e) =>
                              handleChange(
                                field,
                                e.target.value
                              )
                            }

                            style={fieldInputStyle}
                          />

                        </div>

                      ))}

                  </div>

                </div>

              )}

            </div>

          ))}

          <div style={navStyle}>

            <button
              disabled={currentScreen === 0}
              onClick={() =>
                setCurrentScreen(
                  (prev) => prev - 1
                )
              }
              style={buttonStyle}
            >
              PREVIOUS
            </button>

            <button
              disabled={
                currentScreen ===
                screens.length - 1
              }

              onClick={() =>
                setCurrentScreen(
                  (prev) => prev + 1
                )
              }

              style={buttonStyle}
            >
              NEXT
            </button>

          </div>

        </div>

        <div style={savedSessionsStyle}>

          <h2>
            SAVED SESSIONS
          </h2>

          {savedSessions.length === 0 && (
            <div>
              NO SAVED SESSIONS
            </div>
          )}

          {savedSessions.map((session) => (

            <div
              key={session.id}
              style={sessionCardStyle}
            >

              <div>
                {session.trainee}
              </div>

              <div style={timestampStyle}>
                {session.timestamp}
              </div>

              <details>

                <summary>
                  VIEW RESPONSES
                </summary>

                <pre>
                  {JSON.stringify(
                    session.responses,
                    null,
                    2
                  )}
                </pre>

              </details>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

const pageStyle = {
  background: "#000000",
  minHeight: "100vh",
  color: "#1f6fff",
  fontFamily: "Courier New, monospace",
  padding: "10px"
};

const containerStyle = {
  maxWidth: "1600px",
  margin: "0 auto"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px"
};

const buttonContainerStyle = {
  display: "flex",
  gap: "8px"
};

const windowStyle = {
  border: "1px solid #1f6fff",
  padding: "10px",
  background: "#000000"
};

const titleBarStyle = {
  borderBottom: "1px solid #1f6fff",
  paddingBottom: "6px",
  marginBottom: "14px",
  display: "flex",
  justifyContent: "space-between",
  fontSize: "18px",
  fontWeight: "bold"
};

const sectionStyle = {
  marginBottom: "18px",
  padding: "8px",
  background: "#000000"
};

const sectionHeadingStyle = {
  marginBottom: "12px",
  color: "#1f6fff",
  fontWeight: "bold",
  fontSize: "16px",
  letterSpacing: "1px"
};

const twoColumnStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px"
};

const locationRowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  gap: "12px",
  marginBottom: "10px"
};

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "220px 1fr",
  alignItems: "center",
  gap: "8px",
  marginBottom: "6px"
};

const labelStyle = {
  color: "#1f6fff",
  fontSize: "18px",
  whiteSpace: "nowrap",
  fontWeight: "bold"
};

const smallLabelStyle = {
  marginBottom: "4px",
  color: "#1f6fff",
  fontSize: "18px",
  fontWeight: "bold"
};

const fieldInputStyle = {
  background: "#d9d9d9",
  color: "#000000",
  border: "none",
  padding: "2px 4px",
  width: "100%",
  fontFamily: "Courier New, monospace",
  fontSize: "18px",
  height: "24px"
};

const mainInputStyle = {
  background: "#d9d9d9",
  color: "#000000",
  border: "none",
  padding: "2px 4px",
  width: "300px",
  fontFamily: "Courier New, monospace",
  fontSize: "18px",
  height: "24px"
};

const navStyle = {
  marginTop: "20px",
  display: "flex",
  justifyContent: "space-between"
};

const savedSessionsStyle = {
  marginTop: "20px",
  borderTop: "1px solid #1f6fff",
  paddingTop: "14px"
};

const sessionCardStyle = {
  border: "1px solid #1f6fff",
  padding: "10px",
  marginBottom: "10px"
};

const timestampStyle = {
  fontSize: "12px",
  marginBottom: "8px"
};

const buttonStyle = {
  background: "#000000",
  color: "#1f6fff",
  border: "1px solid #1f6fff",
  padding: "6px 10px",
  cursor: "pointer",
  fontFamily: "Courier New, monospace",
  fontSize: "16px",
  fontWeight: "bold"
};
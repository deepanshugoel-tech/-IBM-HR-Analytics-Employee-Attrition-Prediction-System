/* =========================================================
   AI-POWERED HR ANALYTICS & EMPLOYEE ATTRITION PREDICTION
========================================================= */


/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = ""; // same origin (served by FastAPI)

const PREDICT_API =
    `${API_BASE_URL}/predict`;

const SHAP_API =
    `${API_BASE_URL}/explain`;


/* =========================================================
   CURRENT DATE
========================================================= */

const currentDateElement =
    document.getElementById("currentDate");

if (currentDateElement) {

    const today = new Date();

    currentDateElement.textContent =
        today.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
}


/* =========================================================
   CHART.JS GLOBAL SETTINGS
========================================================= */

if (typeof Chart !== "undefined") {

    Chart.defaults.font.family =
        "Arial, Helvetica, sans-serif";

    if (
        Chart.defaults.plugins &&
        Chart.defaults.plugins.legend &&
        Chart.defaults.plugins.legend.labels
    ) {

        Chart.defaults.plugins.legend.labels.usePointStyle =
            true;

    }
}


/* =========================================================
   DASHBOARD CHART REFERENCES
========================================================= */

let departmentChart = null;
let attritionChart = null;


/* =========================================================
   DEPARTMENT-WISE ATTRITION
========================================================= */

const departmentChartElement =
    document.getElementById("departmentChart");

if (
    departmentChartElement &&
    typeof Chart !== "undefined"
) {

    departmentChart = new Chart(
        departmentChartElement,
        {
            type: "bar",

            data: {

                labels: [
                    "Research & Development",
                    "Sales",
                    "Human Resources"
                ],

                datasets: [
                    {
                        label: "Employees Left",

                        data: [
                            133,
                            92,
                            12
                        ],

                        backgroundColor: [
                            "#2563eb",
                            "#7c3aed",
                            "#ef4444"
                        ],

                        borderRadius: 6
                    }
                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {
                        beginAtZero: true
                    }

                }

            }
        }
    );
}


/* =========================================================
   ATTRITION OVERVIEW
========================================================= */

const attritionChartElement =
    document.getElementById("attritionChart");

if (
    attritionChartElement &&
    typeof Chart !== "undefined"
) {

    attritionChart = new Chart(
        attritionChartElement,
        {
            type: "doughnut",

            data: {

                labels: [
                    "Stayed",
                    "Left"
                ],

                datasets: [
                    {
                        data: [
                            1233,
                            237
                        ],

                        backgroundColor: [
                            "#16a34a",
                            "#dc2626"
                        ],

                        borderWidth: 0
                    }
                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "65%",

                plugins: {

                    legend: {
                        position: "bottom"
                    }

                }

            }
        }
    );
}


/* =========================================================
   JOB ROLE ATTRITION
========================================================= */

const jobRoleChartElement =
    document.getElementById("jobRoleChart");

if (
    jobRoleChartElement &&
    typeof Chart !== "undefined"
) {

    new Chart(
        jobRoleChartElement,
        {
            type: "bar",

            data: {

                labels: [
                    "Sales Executive",
                    "Research Scientist",
                    "Lab Technician",
                    "Manufacturing Director",
                    "Healthcare Representative",
                    "Manager",
                    "Sales Representative"
                ],

                datasets: [
                    {
                        label: "Employees Left",

                        data: [
                            57,
                            47,
                            62,
                            10,
                            9,
                            5,
                            33
                        ],

                        backgroundColor: "#6366f1",

                        borderRadius: 5
                    }
                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {
                        beginAtZero: true
                    }

                }

            }
        }
    );
}


/* =========================================================
   GENDER-WISE ATTRITION
========================================================= */

const genderChartElement =
    document.getElementById("genderChart");

if (
    genderChartElement &&
    typeof Chart !== "undefined"
) {

    new Chart(
        genderChartElement,
        {
            type: "bar",

            data: {

                labels: [
                    "Male",
                    "Female"
                ],

                datasets: [
                    {
                        label: "Employees Left",

                        data: [
                            150,
                            87
                        ],

                        backgroundColor: [
                            "#3b82f6",
                            "#ec4899"
                        ],

                        borderRadius: 6
                    }
                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {
                        beginAtZero: true
                    }

                }

            }
        }
    );
}


/* =========================================================
   AGE DISTRIBUTION
========================================================= */

const ageChartElement =
    document.getElementById("ageChart");

if (
    ageChartElement &&
    typeof Chart !== "undefined"
) {

    new Chart(
        ageChartElement,
        {
            type: "line",

            data: {

                labels: [
                    "18-25",
                    "26-30",
                    "31-35",
                    "36-40",
                    "41-45",
                    "46-50",
                    "51+"
                ],

                datasets: [
                    {
                        label: "Employees",

                        data: [
                            120,
                            280,
                            350,
                            300,
                            210,
                            140,
                            70
                        ],

                        borderColor: "#2563eb",

                        backgroundColor:
                            "rgba(37, 99, 235, 0.10)",

                        fill: true,

                        tension: 0.4,

                        pointRadius: 4
                    }
                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                scales: {

                    y: {
                        beginAtZero: true
                    }

                }

            }
        }
    );
}


/* =========================================================
   JOB SATISFACTION
========================================================= */

const satisfactionChartElement =
    document.getElementById("satisfactionChart");

if (
    satisfactionChartElement &&
    typeof Chart !== "undefined"
) {

    new Chart(
        satisfactionChartElement,
        {
            type: "bar",

            data: {

                labels: [
                    "Low",
                    "Medium",
                    "High",
                    "Very High"
                ],

                datasets: [
                    {
                        label: "Employees",

                        data: [
                            280,
                            300,
                            460,
                            430
                        ],

                        backgroundColor: "#14b8a6",

                        borderRadius: 6
                    }
                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {
                        beginAtZero: true
                    }

                }

            }
        }
    );
}


/* =========================================================
   FEATURE IMPORTANCE
========================================================= */

const featureImportanceChartElement =
    document.getElementById(
        "featureImportanceChart"
    );

if (
    featureImportanceChartElement &&
    typeof Chart !== "undefined"
) {

    new Chart(
        featureImportanceChartElement,
        {
            type: "bar",

            data: {

                labels: [
                    "MonthlyIncome",
                    "OverTime_Yes",
                    "DailyRate",
                    "EmployeeNumber",
                    "Age",
                    "TotalWorkingYears",
                    "MonthlyRate",
                    "HourlyRate",
                    "DistanceFromHome",
                    "YearsAtCompany"
                ],

                datasets: [
                    {
                        label: "Feature Importance",

                        data: [
                            0.071784,
                            0.061896,
                            0.054603,
                            0.049249,
                            0.048570,
                            0.047738,
                            0.047392,
                            0.041425,
                            0.040048,
                            0.036038
                        ],

                        backgroundColor: "#8b5cf6",

                        borderRadius: 5
                    }
                ]
            },

            options: {

                indexAxis: "y",

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        callbacks: {

                            label: function(context) {

                                const value =
                                    Number(context.raw) * 100;

                                return (
                                    " Importance: " +
                                    value.toFixed(2) +
                                    "%"
                                );

                            }

                        }

                    }

                },

                scales: {

                    x: {

                        beginAtZero: true,

                        ticks: {

                            callback: function(value) {

                                return (
                                    Number(value) * 100 +
                                    "%"
                                );

                            }

                        }

                    }

                }

            }

        }
    );
}


/* =========================================================
   PREDICTION HISTORY
========================================================= */

let predictionHistory = [];

try {

    predictionHistory =
        JSON.parse(
            localStorage.getItem(
                "hrPredictionHistory"
            )
        ) || [];

    if (!Array.isArray(predictionHistory)) {
        predictionHistory = [];
    }

}
catch (error) {

    console.warn(
        "Prediction history could not be loaded.",
        error
    );

    predictionHistory = [];

}


/* =========================================================
   SAVE PREDICTION HISTORY
========================================================= */
function savePredictionHistory(data) {

    predictionHistory.unshift(data);

    predictionHistory =
        predictionHistory.slice(0, 20);

    try {

        localStorage.setItem(
            "hrPredictionHistory",
            JSON.stringify(predictionHistory)
        );

    }
    catch (error) {

        console.error(
            "Unable to save prediction history:",
            error
        );

    }

    renderPredictionHistory();

    // Update High-Risk Employees table
    updateHighRiskEmployees();
}


/* =========================================================
   RENDER PREDICTION HISTORY
========================================================= */

function renderPredictionHistory() {

    const historyBody =
        document.getElementById(
            "predictionHistoryBody"
        );

    if (!historyBody) {
        return;
    }


    if (
        predictionHistory.length === 0
    ) {

        historyBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="no-history"
                >
                    No predictions yet.
                </td>

            </tr>

        `;

        return;
    }


    historyBody.innerHTML =
        predictionHistory
            .map(function(item) {

                const prediction =
                    String(
                        item.prediction || ""
                    );

                const riskLevel =
                    String(
                        item.riskLevel || "Unknown"
                    );


                const predictionClass =
                    prediction === "Yes"
                        ? "history-danger"
                        : "history-success";


                const riskLower =
                    riskLevel.toLowerCase();


                const riskClass =
                    riskLower.includes("high")
                        ? "history-danger"

                        : riskLower.includes("medium")
                            ? "history-warning"

                            : "history-success";


                const income =
                    Number(
                        item.income || 0
                    );


                return `

                    <tr>

                        <td>
                            ${item.time || "-"}
                        </td>

                        <td>
                            ${item.age ?? "-"}
                        </td>

                        <td>
                            ₹${income.toLocaleString(
                                "en-IN"
                            )}
                        </td>

                        <td>
                            ${item.overtime || "-"}
                        </td>

                        <td>
                            ${item.yearsCompany ?? "-"}
                        </td>

                        <td
                            class="${predictionClass}"
                        >

                            ${
                                prediction === "Yes"
                                    ? "Likely to Leave"
                                    : "Likely to Stay"
                            }

                        </td>

                        <td>
                            ${item.riskPercentage ?? 0}%
                        </td>

                        <td
                            class="${riskClass}"
                        >
                            ${riskLevel}
                        </td>

                    </tr>

                `;

            })
            .join("");
}


/* =========================================================
   ADD PREDICTION TO HISTORY
========================================================= */

function addCurrentPredictionToHistory(
    age,
    income,
    yearsCompany,
    overtime,
    prediction,
    riskPercentage,
    riskLevel
) {

    const now =
        new Date();


    const time =
        now.toLocaleString(
            "en-IN",
            {
                dateStyle: "short",
                timeStyle: "short"
            }
        );


    savePredictionHistory({

        time: time,

        age: age,

        income: income,

        overtime: overtime,

        yearsCompany:
            yearsCompany,

        prediction:
            prediction,

        riskPercentage:
            riskPercentage,

        riskLevel:
            riskLevel

    });
}


/* =========================================================
   CLEAR HISTORY
   FIXED — ONLY ONE EVENT LISTENER
========================================================= */

const clearHistoryBtn =
    document.getElementById(
        "clearHistoryBtn"
    );

if (clearHistoryBtn) {

    clearHistoryBtn.addEventListener(
        "click",
        function() {

            const confirmClear =
                confirm(
                    "Are you sure you want to clear prediction history?"
                );


            if (!confirmClear) {
                return;
            }


            predictionHistory = [];


            localStorage.removeItem(
                "hrPredictionHistory"
            );


            renderPredictionHistory();
            updateHighRiskEmployees();


            console.log(
                "Prediction history cleared."
            );

        }
    );

}


/* =========================================================
   INITIAL HISTORY LOAD
========================================================= */

renderPredictionHistory();


/* =========================================================
   PREDICTION FORM
========================================================= */

const predictionForm =
    document.getElementById(
        "predictionForm"
    );


if (predictionForm) {

    predictionForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            /* =================================================
               GET FORM VALUES
            ================================================= */

            const ageInput =
                document.getElementById(
                    "age"
                );


            const incomeInput =
                document.getElementById(
                    "income"
                );


            const yearsCompanyInput =
                document.getElementById(
                    "yearsCompany"
                );


            const satisfactionInput =
                document.getElementById(
                    "satisfaction"
                );


            const overtimeInput =
                document.getElementById(
                    "overtime"
                );


            const jobLevelInput =
                document.getElementById(
                    "jobLevel"
                );


            if (
                !ageInput ||
                !incomeInput ||
                !yearsCompanyInput ||
                !satisfactionInput ||
                !overtimeInput ||
                !jobLevelInput
            ) {

                console.error(
                    "Prediction form fields are missing."
                );

                return;
            }


            const age =
                Number(
                    ageInput.value
                );


            const income =
                Number(
                    incomeInput.value
                );


            const yearsCompany =
                Number(
                    yearsCompanyInput.value
                );


            const satisfaction =
                Number(
                    satisfactionInput.value
                );


            const overtime =
                overtimeInput.value;


            const jobLevel =
                Number(
                    jobLevelInput.value
                );


            /* =================================================
               RESULT ELEMENTS
            ================================================= */

            const predictionMessage =
                document.getElementById(
                    "predictionMessage"
                );


            const riskScore =
                document.getElementById(
                    "riskScore"
                );


            const riskLabel =
                document.getElementById(
                    "riskLabel"
                );


            const riskProgress =
                document.getElementById(
                    "riskProgress"
                );


            const explanationText =
                document.getElementById(
                    "explanationText"
                );


            /* =================================================
               RESET RESULT
            ================================================= */

            if (predictionMessage) {

                predictionMessage.textContent =
                    "Analyzing employee data using Machine Learning...";

            }


            if (riskScore) {

                riskScore.textContent =
                    "--%";

            }


            if (riskLabel) {

                riskLabel.textContent =
                    "Analyzing...";

                riskLabel.style.color =
                    "#2563eb";

            }


            if (riskProgress) {

                riskProgress.style.width =
                    "0%";

                riskProgress.style.background =
                    "#2563eb";

            }


            if (explanationText) {

                explanationText.textContent =
                    "Generating employee attrition prediction...";

            }


            /* =================================================
               DISABLE BUTTON WHILE PROCESSING
            ================================================= */

            const predictButton =
                predictionForm.querySelector(
                    'button[type="submit"]'
                );


            if (predictButton) {

                predictButton.disabled =
                    true;

                predictButton.textContent =
                    "⏳ Analyzing...";

            }


            /* =================================================
               ML PREDICTION
            ================================================= */

            try {

                console.log(
                    "Sending prediction request:",
                    {
                        Age: age,
                        MonthlyIncome: income,
                        YearsAtCompany: yearsCompany,
                        JobSatisfaction: satisfaction,
                        OverTime: overtime,
                        JobLevel: jobLevel
                    }
                );


                const response =
                    await fetch(
                        PREDICT_API,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                Age:
                                    age,

                                MonthlyIncome:
                                    income,

                                YearsAtCompany:
                                    yearsCompany,

                                JobSatisfaction:
                                    satisfaction,

                                OverTime:
                                    overtime,

                                JobLevel:
                                    jobLevel

                            })

                        }
                    );


                /* =================================================
                   API ERROR
                ================================================= */

                if (!response.ok) {

                    let errorMessage =
                        "Prediction request failed.";

                    try {

                        const errorData =
                            await response.json();

                        errorMessage =
                            errorData.detail ||
                            errorMessage;

                    }
                    catch (jsonError) {

                        console.warn(
                            "Could not parse prediction error."
                        );

                    }


                    throw new Error(
                        errorMessage
                    );

                }


                /* =================================================
                   READ ML RESULT
                ================================================= */

                const result =
                    await response.json();


                console.log(
                    "ML Prediction Result:",
                    result
                );


                const riskPercentage =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            Number(
                                result.risk_percentage || 0
                            )
                        )
                    );


                const riskLevel =
                    result.risk_level ||
                    "Unknown";


                const prediction =
                    result.prediction ||
                    "Unknown";


                /* =================================================
                   SAVE HISTORY
                ================================================= */

                addCurrentPredictionToHistory(
                    age,
                    income,
                    yearsCompany,
                    overtime,
                    prediction,
                    riskPercentage,
                    riskLevel
                );


                /* =================================================
                   RISK SCORE
                ================================================= */

                if (riskScore) {

                    riskScore.textContent =
                        riskPercentage +
                        "%";

                }


                /* =================================================
                   RISK LEVEL
                ================================================= */

                if (riskLabel) {

                    riskLabel.textContent =
                        riskLevel;


                    const level =
                        String(
                            riskLevel
                        ).toLowerCase();


                    if (
                        level.includes("low")
                    ) {

                        riskLabel.style.color =
                            "#16a34a";

                    }

                    else if (
                        level.includes("medium")
                    ) {

                        riskLabel.style.color =
                            "#d97706";

                    }

                    else if (
                        level.includes("high")
                    ) {

                        riskLabel.style.color =
                            "#dc2626";

                    }

                }


                /* =================================================
                   RISK PROGRESS
                ================================================= */

                if (riskProgress) {

                    riskProgress.style.width =
                        riskPercentage +
                        "%";


                    const level =
                        String(
                            riskLevel
                        ).toLowerCase();


                    if (
                        level.includes("low")
                    ) {

                        riskProgress.style.background =
                            "#16a34a";

                    }

                    else if (
                        level.includes("medium")
                    ) {

                        riskProgress.style.background =
                            "#d97706";

                    }

                    else if (
                        level.includes("high")
                    ) {

                        riskProgress.style.background =
                            "#dc2626";

                    }

                }


                /* =================================================
                   PREDICTION MESSAGE
                ================================================= */

                if (predictionMessage) {

                    const predictionText =
                        String(
                            prediction
                        ).toLowerCase();


                    if (
                        predictionText === "yes" ||
                        predictionText.includes("leave")
                    ) {

                        predictionMessage.textContent =
                            "⚠️ Employee is predicted to leave the company.";

                    }

                    else {

                        predictionMessage.textContent =
                            "✅ Employee is predicted to stay with the company.";

                    }

                }


                /* =================================================
                   EMPLOYEE FACTORS
                ================================================= */

                const explanationOvertime =
                    document.getElementById(
                        "explanationOvertime"
                    );


                const explanationIncome =
                    document.getElementById(
                        "explanationIncome"
                    );


                const explanationYears =
                    document.getElementById(
                        "explanationYears"
                    );


                const explanationSatisfaction =
                    document.getElementById(
                        "explanationSatisfaction"
                    );


                if (explanationOvertime) {

                    explanationOvertime.textContent =
                        overtime === "Yes"
                            ? "Yes"
                            : "No";

                }


                if (explanationIncome) {

                    explanationIncome.textContent =
                        "₹" +
                        income.toLocaleString(
                            "en-IN"
                        );

                }


                if (explanationYears) {

                    explanationYears.textContent =
                        yearsCompany +
                        (
                            yearsCompany === 1
                                ? " year"
                                : " years"
                        );

                }


                if (explanationSatisfaction) {

                    explanationSatisfaction.textContent =
                        satisfaction +
                        " / 4";

                }


                /* =================================================
                   SHAP EXPLAINABLE AI
                ================================================= */

                try {

                    if (explanationText) {

                        explanationText.textContent =
                            "Generating SHAP-based Explainable AI analysis...";

                    }


                    console.log(
                        "Sending SHAP explanation request..."
                    );


                    const shapResponse =
                        await fetch(
                            SHAP_API,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    Age:
                                        age,

                                    MonthlyIncome:
                                        income,

                                    YearsAtCompany:
                                        yearsCompany,

                                    JobSatisfaction:
                                        satisfaction,

                                    OverTime:
                                        overtime,

                                    JobLevel:
                                        jobLevel

                                })

                            }
                        );


                    /* =================================================
                       SHAP API ERROR
                    ================================================= */

                    if (!shapResponse.ok) {

                        let shapError =
                            "SHAP explanation request failed.";

                        try {

                            const errorData =
                                await shapResponse.json();

                            shapError =
                                errorData.detail ||
                                shapError;

                        }
                        catch (jsonError) {

                            console.warn(
                                "Could not parse SHAP error."
                            );

                        }


                        throw new Error(
                            shapError
                        );

                    }


                    /* =================================================
                       READ SHAP RESULT
                    ================================================= */

                    const shapResult =
                        await shapResponse.json();


                    console.log(
                        "SHAP Explanation Result:",
                        shapResult
                    );


                    const topFactors =
                        Array.isArray(
                            shapResult.top_factors
                        )
                            ? shapResult.top_factors
                            : [];


                    console.log(
                        "========== TOP SHAP FACTORS =========="
                    );


                    topFactors.forEach(
                        function(
                            factor,
                            index
                        ) {

                            console.log(

                                `${index + 1}. ` +
                                `${factor.feature} | ` +
                                `${factor.impact} | ` +
                                `SHAP Value: ` +
                                `${factor.shap_value}`

                            );

                        }
                    );


                    /* =================================================
                       REMOVE TECHNICAL IDENTIFIERS
                    ================================================= */

                    const businessFactors =
                        topFactors.filter(
                            function(factor) {

                                const feature =
                                    String(
                                        factor.feature ||
                                        ""
                                    ).toLowerCase();


                                return (
                                    feature !==
                                    "employeenumber" &&

                                    feature !==
                                    "employee number" &&

                                    feature !==
                                    "id"
                                );

                            }
                        );


                    /* =================================================
                       TOP 5 BUSINESS FACTORS
                    ================================================= */

                    const topFive =
                        businessFactors.slice(
                            0,
                            5
                        );


                    /* =================================================
                       SHAP CONTAINER
                    ================================================= */

                    const shapFactorsContainer =
                        document.getElementById(
                            "shapFactorsContainer"
                        );


                    if (
                        shapFactorsContainer
                    ) {

                        shapFactorsContainer.innerHTML =
                            "";


                        if (
                            topFive.length === 0
                        ) {

                            shapFactorsContainer.innerHTML = `

                                <div class="shap-empty">

                                    No business-relevant SHAP factors
                                    were returned.

                                </div>

                            `;

                        }


                        /* =================================================
                           CREATE SHAP CARDS
                        ================================================= */

                        topFive.forEach(
                            function(
                                factor,
                                index
                            ) {

                                const card =
                                    document.createElement(
                                        "div"
                                    );


                                card.className =
                                    "shap-factor-card";


                                /* -----------------------------------------
                                   FEATURE NAME
                                ----------------------------------------- */

                                const featureName =
                                    String(
                                        factor.feature ||
                                        "Unknown Feature"
                                    );


                                /* -----------------------------------------
                                   SHAP VALUE
                                ----------------------------------------- */

                                const shapValue =
                                    Number(
                                        factor.shap_value || 0
                                    );


                                /* -----------------------------------------
                                   IMPACT
                                ----------------------------------------- */

                                const impact =
                                    String(
                                        factor.impact ||
                                        "Neutral impact"
                                    );


                                const impactLower =
                                    impact.toLowerCase();


                                let impactClass =
                                    "shap-neutral";


                                let impactIcon =
                                    "•";


                                if (
                                    impactLower.includes(
                                        "increases"
                                    )
                                ) {

                                    impactClass =
                                        "shap-positive";

                                    impactIcon =
                                        "↑";

                                }

                                else if (
                                    impactLower.includes(
                                        "reduces"
                                    )
                                ) {

                                    impactClass =
                                        "shap-negative";

                                    impactIcon =
                                        "↓";

                                }


                                /* -----------------------------------------
                                   CARD HTML
                                ----------------------------------------- */

                                card.innerHTML = `

                                    <div
                                        class="shap-factor-left"
                                    >

                                        <div
                                            class="shap-factor-number"
                                        >
                                            ${index + 1}
                                        </div>

                                        <div
                                            class="shap-factor-name"
                                        >
                                            ${featureName}
                                        </div>

                                    </div>


                                    <div
                                        class="shap-factor-right"
                                    >

                                        <span
                                            class="shap-impact ${impactClass}"
                                        >

                                            ${impactIcon}
                                            ${impact}

                                        </span>


                                        <span
                                            class="shap-value"
                                        >

                                            SHAP:
                                            ${
                                                shapValue >= 0
                                                    ? "+"
                                                    : ""
                                            }${shapValue.toFixed(4)}

                                        </span>

                                    </div>

                                `;


                                shapFactorsContainer
                                    .appendChild(
                                        card
                                    );

                            }
                        );

                    }


                    /* =================================================
                       SHAP EXPLANATION TEXT
                    ================================================= */

                    if (explanationText) {

                        if (
                            topFive.length > 0
                        ) {

                            explanationText.textContent =
                                "SHAP Explainable AI analyzed this employee and identified the business-relevant factors below as the strongest influences on the prediction.";

                        }

                        else {

                            explanationText.textContent =
                                "The prediction was completed, but no business-relevant SHAP factors were returned.";

                        }

                    }


                    /* =================================================
                       SAVE LATEST SHAP RESULT
                    ================================================= */

                    window.latestSHAPExplanation =
                        shapResult;


                    console.log(
                        "Complete SHAP Result:",
                        shapResult
                    );

                }


                /* =================================================
                   SHAP ERROR HANDLING
                ================================================= */

                catch (shapError) {

                    console.error(
                        "SHAP Explanation Error:",
                        shapError
                    );


                    if (explanationText) {

                        explanationText.textContent =
                            "The employee prediction was completed, but SHAP explainability could not be loaded. Please make sure the /explain API is running.";

                    }


                    const shapFactorsContainer =
                        document.getElementById(
                            "shapFactorsContainer"
                        );


                    if (
                        shapFactorsContainer
                    ) {

                        shapFactorsContainer.innerHTML = `

                            <div class="shap-empty">

                                SHAP explanation is currently
                                unavailable.

                            </div>

                        `;

                    }

                }

            }


            /* =================================================
               MAIN PREDICTION ERROR
            ================================================= */

            catch (error) {

                console.error(
                    "Prediction API Error:",
                    error
                );


                if (predictionMessage) {

                    predictionMessage.textContent =
                        "❌ Unable to connect with the Machine Learning API. Please make sure FastAPI backend is running.";

                }


                if (riskScore) {

                    riskScore.textContent =
                        "--%";

                }


                if (riskLabel) {

                    riskLabel.textContent =
                        "API Error";

                    riskLabel.style.color =
                        "#dc2626";

                }


                if (riskProgress) {

                    riskProgress.style.width =
                        "0%";

                    riskProgress.style.background =
                        "#dc2626";

                }


                if (explanationText) {

                    explanationText.textContent =
                        "Prediction could not be completed because the FastAPI backend is not responding.";

                }

            }


            /* =================================================
               ENABLE BUTTON
            ================================================= */

            finally {

                if (predictButton) {

                    predictButton.disabled =
                        false;

                    predictButton.textContent =
                        "🤖 Predict Attrition Risk";

                }

            }

        }
    );

}


/* =========================================================
   SIDEBAR NAVIGATION
========================================================= */

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


const pageSections =
    document.querySelectorAll(
        ".page-section"
    );


/* =========================================================
   NAV LINK CLICK
========================================================= */

navLinks.forEach(
    function(link) {

        link.addEventListener(
            "click",
            function(event) {

                const targetId =
                    this.getAttribute(
                        "href"
                    );


                if (
                    targetId &&
                    targetId.startsWith("#")
                ) {

                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (target) {

                        event.preventDefault();


                        target.scrollIntoView({

                            behavior:
                                "smooth",

                            block:
                                "start"

                        });

                    }

                }

            }
        );

    }
);


/* =========================================================
   ACTIVE NAVIGATION ON SCROLL
========================================================= */

window.addEventListener(
    "scroll",
    function() {

        let currentSection =
            "";


        pageSections.forEach(
            function(section) {

                const sectionTop =
                    section.offsetTop;


                if (
                    window.scrollY >=
                    sectionTop - 180
                ) {

                    currentSection =
                        section.getAttribute(
                            "id"
                        );

                }

            }
        );


        navLinks.forEach(
            function(link) {

                link.classList.remove(
                    "active"
                );


                const href =
                    link.getAttribute(
                        "href"
                    );


                if (
                    href ===
                    "#" +
                    currentSection
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);


/* =========================================================
   SYSTEM STATUS
========================================================= */

console.log(
    "=========================================="
);

console.log(
    "HR Analytics System Loaded Successfully."
);

console.log(
    "Real ML Prediction API:",
    PREDICT_API
);

console.log(
    "SHAP Explainable AI API:",
    SHAP_API
);

console.log(
    "Backend Documentation:",
    `${API_BASE_URL}/docs`
);

console.log(
    "Prediction History: LocalStorage enabled."
);

console.log(
    "EmployeeNumber filtering: ENABLED"
);

console.log(
    "Business-relevant SHAP display: ENABLED"
);

console.log(
    "=========================================="
);
// =========================================================
// REAL DASHBOARD DATA FROM BACKEND
// =========================================================

async function loadDashboardData() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/dashboard-summary`
        );

        if (!response.ok) {
            throw new Error(
                "Dashboard API request failed."
            );
        }

        const data = await response.json();

        console.log(
            "Dashboard data loaded:",
            data
        );


        // =================================================
        // UPDATE KPI CARDS
        // =================================================

        const totalEmployees =
            document.getElementById(
                "totalEmployees"
            );

        const employeesLeft =
            document.getElementById(
                "employeesLeft"
            );

        const attritionRate =
            document.getElementById(
                "attritionRate"
            );

        const avgIncome =
            document.getElementById(
                "avgIncome"
            );


        if (totalEmployees) {

            totalEmployees.textContent =
                Number(
                    data.total_employees
                ).toLocaleString("en-IN");

        }


        if (employeesLeft) {

            employeesLeft.textContent =
                Number(
                    data.employees_left
                ).toLocaleString("en-IN");

        }


        if (attritionRate) {

            attritionRate.textContent =
                `${data.attrition_rate}%`;

        }


        if (avgIncome) {
    avgIncome.textContent =
        `₹${Number(
            data.average_monthly_income
        ).toLocaleString("en-IN", {
            maximumFractionDigits: 0
        })}`;
}


        // =================================================
        // DEPARTMENT CHART
        // =================================================

        if (
            typeof departmentChart !== "undefined" &&
            departmentChart
        ) {

            departmentChart.data.labels =
                Object.keys(
                    data.department_attrition
                );

            departmentChart.data.datasets[0].data =
                Object.values(
                    data.department_attrition
                );

            departmentChart.update();

        }


        // =================================================
        // ATTRITION CHART
        // =================================================

        if (
            typeof attritionChart !== "undefined" &&
            attritionChart
        ) {

            attritionChart.data.labels =
                Object.keys(
                    data.attrition_distribution
                );

            attritionChart.data.datasets[0].data =
                Object.values(
                    data.attrition_distribution
                );

            attritionChart.update();

        }


        console.log(
            "Dashboard updated successfully."
        );

    }
    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}

// ============================================================
// REAL HIGH-RISK EMPLOYEES FROM FASTAPI (TOP 20 + VIEW ALL)
// ============================================================

let highRiskEmployeesData = [];
let highRiskTotal = 0;
let showAllHighRisk = false;


function renderHighRiskTable() {

    const tableBody =
        document.getElementById("highRiskEmployeesBody");

    const showingText =
        document.getElementById("showing");

    const viewAllButton =
        document.getElementById("viewAllBtn");

    if (!tableBody) {
        return;
    }

    // Sabse zyada risk pehle
    const sorted =
        [...highRiskEmployeesData].sort(function(a, b) {
            return Number(b.risk_percentage || 0) -
                   Number(a.risk_percentage || 0);
        });

    const list =
        showAllHighRisk
            ? sorted
            : sorted.slice(0, 20);

    if (list.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No high-risk employees identified.
                </td>
            </tr>
        `;

        if (showingText) showingText.textContent = "Showing 0";
        if (viewAllButton) viewAllButton.style.display = "none";

        return;
    }

    tableBody.innerHTML =
        list.map(function(employee) {

            const employeeNumber =
                employee.employee_number ?? "-";

            const age =
                employee.age ?? "-";

            const income =
                Number(
                    employee.monthly_income || 0
                ).toLocaleString("en-IN");

            const overtime =
                employee.overtime ?? "-";

            const risk =
                Number(employee.risk_percentage || 0);

            const riskLevel =
                employee.risk_level || "High";

            return `
                <tr>
                    <td><strong>Employee ${employeeNumber}</strong></td>
                    <td>${age}</td>
                    <td>₹${income}</td>
                    <td><span class="overtime-badge">${overtime}</span></td>
                    <td><strong>${risk}%</strong></td>
                    <td><span class="risk-badge high">🔴 ${riskLevel}</span></td>
                </tr>
            `;

        }).join("");


    // Footer text + button
    const total = sorted.length;

    if (showingText) {
        showingText.textContent =
            showAllHighRisk
                ? `Showing all ${total}`
                : `Showing top ${list.length} of ${total}`;
    }

    if (viewAllButton) {

        // 20 ya kam employees hain toh button ki zaroorat nahi
        viewAllButton.style.display =
            total > 20 ? "inline-block" : "none";

        viewAllButton.textContent =
            showAllHighRisk
                ? "Show Less"
                : `View All (${total})`;
    }
}


async function updateHighRiskEmployees() {

    const tableBody =
        document.getElementById("highRiskEmployeesBody");

    const highRiskCount =
        document.getElementById("highRiskCount");

    if (!tableBody || !highRiskCount) {
        return;
    }

    try {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    Loading high-risk employees...
                </td>
            </tr>
        `;

        const response = await fetch(
            `${API_BASE_URL}/high-risk-employees`
        );

        if (!response.ok) {
            throw new Error(
                `High-risk API failed: HTTP ${response.status}`
            );
        }

        const data = await response.json();

        highRiskEmployeesData =
            Array.isArray(data.employees)
                ? data.employees
                : [];

        highRiskTotal =
            data.total_high_risk ?? highRiskEmployeesData.length;

        // Count hamesha total dikhaye (198)
        highRiskCount.textContent = highRiskTotal;

        renderHighRiskTable();

    }
    catch (error) {

        console.error(
            "High-risk employees API error:",
            error
        );

        highRiskCount.textContent = "0";

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    ❌ Unable to load high-risk employees.
                </td>
            </tr>
        `;
    }
}


// View All / Show Less button
const viewAllBtnElement =
    document.getElementById("viewAllBtn");

if (viewAllBtnElement) {

    viewAllBtnElement.addEventListener("click", function() {

        showAllHighRisk = !showAllHighRisk;
        renderHighRiskTable();

    });
}
// =========================================================
// LOAD DASHBOARD DATA
// =========================================================

loadDashboardData();
// ============================================================
// LOAD HIGH-RISK EMPLOYEES
// ============================================================

updateHighRiskEmployees();

// ============================================================
// EMPLOYEE SEARCH
// ============================================================

async function searchEmployees() {

    const tableBody =
        document.getElementById("employeeSearchBody");

    const employeeSearchCount =
        document.getElementById("employeeSearchCount");

    if (!tableBody || !employeeSearchCount) {
        return;
    }

    // ---------------------------------------------------------
    // GET FILTER VALUES
    // ---------------------------------------------------------

    const department =
        document.getElementById("searchDepartment")?.value || "All";

    const jobRole =
        document.getElementById("searchJobRole")?.value || "All";

    const gender =
        document.getElementById("searchGender")?.value || "All";

    const overtime =
        document.getElementById("searchOvertime")?.value || "All";

    const attrition =
        document.getElementById("searchAttrition")?.value || "All";


    // ---------------------------------------------------------
    // SHOW LOADING
    // ---------------------------------------------------------

    tableBody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align:center;">
                🔄 Searching employees...
            </td>
        </tr>
    `;

    employeeSearchCount.textContent = "...";


    try {

        // -----------------------------------------------------
        // BUILD API URL
        // -----------------------------------------------------

        const params = new URLSearchParams({

            department: department,
            job_role: jobRole,
            gender: gender,
            overtime: overtime,
            attrition: attrition

        });


        const response =
            await fetch(
                `${API_BASE_URL}/employees/search?${params.toString()}`
            );


        // -----------------------------------------------------
        // API ERROR
        // -----------------------------------------------------

        if (!response.ok) {

            throw new Error(
                `Employee Search API failed: HTTP ${response.status}`
            );

        }


        // -----------------------------------------------------
        // READ RESPONSE
        // -----------------------------------------------------

        const data =
            await response.json();


        console.log(
            "Employee Search Result:",
            data
        );


        // -----------------------------------------------------
        // GET EMPLOYEES
        // -----------------------------------------------------

        const employees =
            Array.isArray(data.employees)
                ? data.employees
                : [];


        // -----------------------------------------------------
        // UPDATE COUNT
        // -----------------------------------------------------

        employeeSearchCount.textContent =
            data.total ?? employees.length;


        // -----------------------------------------------------
        // NO RESULTS
        // -----------------------------------------------------

        if (employees.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        style="text-align:center;"
                    >
                        ❌ No employees found for the selected filters.
                    </td>
                </tr>
            `;

            return;
        }


        // -----------------------------------------------------
        // CREATE TABLE ROWS
        // -----------------------------------------------------

        tableBody.innerHTML =
            employees.map(function(employee) {

                const employeeNumber =
                    employee.employee_number ?? "-";

                const age =
                    employee.age ?? "-";

                const departmentName =
                    employee.department ?? "-";

                const jobRoleName =
                    employee.job_role ?? "-";

                const employeeGender =
                    employee.gender ?? "-";

                const employeeOvertime =
                    employee.overtime ?? "-";

                const income =
                    Number(
                        employee.monthly_income || 0
                    ).toLocaleString("en-IN");

                const attritionStatus =
                    employee.attrition ?? "-";


                // -------------------------------------------------
                // ATTRITION BADGE
                // -------------------------------------------------

                const attritionBadge =
                    String(attritionStatus).toLowerCase() === "yes"

                        ? `
                            <span class="risk-badge high">
                                🔴 Left
                            </span>
                          `

                        : `
                            <span class="risk-badge low">
                                🟢 Active
                            </span>
                          `;


                // -------------------------------------------------
                // OVERTIME BADGE
                // -------------------------------------------------

                const overtimeBadge =
                    String(employeeOvertime).toLowerCase() === "yes"

                        ? `
                            <span class="overtime-badge">
                                Yes
                            </span>
                          `

                        : `
                            <span>
                                No
                            </span>
                          `;


                return `
                    <tr>

                        <td>
                            <strong>
                                Employee ${employeeNumber}
                            </strong>
                        </td>

                        <td>
                            ${age}
                        </td>

                        <td>
                            ${departmentName}
                        </td>

                        <td>
                            ${jobRoleName}
                        </td>

                        <td>
                            ${employeeGender}
                        </td>

                        <td>
                            ${overtimeBadge}
                        </td>

                        <td>
                            ₹${income}
                        </td>

                        <td>
                            ${attritionBadge}
                        </td>

                    </tr>
                `;

            }).join("");


    }
    catch (error) {

        console.error(
            "Employee Search Error:",
            error
        );


        employeeSearchCount.textContent =
            "0";


        tableBody.innerHTML = `
            <tr>

                <td
                    colspan="8"
                    style="text-align:center;"
                >

                    ❌ Unable to load employee records.

                    <br>

                    <small>
                        Make sure FastAPI backend is running.
                    </small>

                </td>

            </tr>
        `;

    }

}



// ============================================================
// EMPLOYEE SEARCH BUTTON
// ============================================================

const searchEmployeesBtn =
    document.getElementById(
        "searchEmployeesBtn"
    );


if (searchEmployeesBtn) {

    searchEmployeesBtn.addEventListener(
        "click",
        function() {

            searchEmployees();

        }
    );

}



// ============================================================
// RESET EMPLOYEE SEARCH
// ============================================================

const resetEmployeeSearchBtn =
    document.getElementById(
        "resetEmployeeSearchBtn"
    );


if (resetEmployeeSearchBtn) {

    resetEmployeeSearchBtn.addEventListener(
        "click",
        function() {

            const searchDepartment =
                document.getElementById(
                    "searchDepartment"
                );

            const searchJobRole =
                document.getElementById(
                    "searchJobRole"
                );

            const searchGender =
                document.getElementById(
                    "searchGender"
                );

            const searchOvertime =
                document.getElementById(
                    "searchOvertime"
                );

            const searchAttrition =
                document.getElementById(
                    "searchAttrition"
                );


            if (searchDepartment) {
                searchDepartment.value = "All";
            }

            if (searchJobRole) {
                searchJobRole.value = "All";
            }

            if (searchGender) {
                searchGender.value = "All";
            }

            if (searchOvertime) {
                searchOvertime.value = "All";
            }

            if (searchAttrition) {
                searchAttrition.value = "All";
            }


            // Reload all employees
            searchEmployees();

        }
    );

}


console.log(
    "Employee Search Module: ENABLED"
);

/* =========================================================
   HR ACTION CENTER MODULE - API INTEGRATION
========================================================= */

let actionCenterEmployees = [];
let actionCenterLoaded = false;
let actionCenterVisibleCount = 10;
const ACTION_CENTER_PAGE_SIZE = 10;
const ACTION_REVIEW_STORAGE_KEY = "hrActionCenterReviewed_v1";

let actionReviewedMap = {};

function getActionReviewedMap() {
    return actionReviewedMap;
}

// Review status is stored in the database (shared by all HR users).
async function loadActionReviews() {
    const response = await fetch(`${API_BASE_URL}/action-reviews`);
    if (!response.ok) throw new Error(`Review status API returned HTTP ${response.status}`);
    const data = await response.json();
    actionReviewedMap = (data && data.reviews) || {};

    // One-time move of statuses saved earlier in this browser (old localStorage version).
    try {
        const old = JSON.parse(localStorage.getItem(ACTION_REVIEW_STORAGE_KEY) || "{}");
        const pending = Object.keys(old || {})
            .filter(id => old[id] && /^\d+$/.test(id) && !actionReviewedMap[id])
            .map(Number);
        if (pending.length) {
            const res = await fetch(`${API_BASE_URL}/action-reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employee_numbers: pending })
            });
            if (res.ok) {
                pending.forEach(id => { actionReviewedMap[String(id)] = { reviewed: true }; });
                localStorage.removeItem(ACTION_REVIEW_STORAGE_KEY);
            }
        } else if (localStorage.getItem(ACTION_REVIEW_STORAGE_KEY)) {
            localStorage.removeItem(ACTION_REVIEW_STORAGE_KEY);
        }
    } catch (error) {
        console.warn("Old review statuses were not migrated:", error);
    }
}

function escapeActionHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
        return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
    });
}

function updateActionCenterCounters() {
    const reviewed = getActionReviewedMap();
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };
    setText("actionTotalCount", actionCenterEmployees.length.toLocaleString("en-IN"));
    setText("actionHighCount", actionCenterEmployees.filter(e => e.risk_level === "High").length.toLocaleString("en-IN"));
    setText("actionMediumCount", actionCenterEmployees.filter(e => e.risk_level === "Medium").length.toLocaleString("en-IN"));
    setText("actionReviewedCount", Object.keys(reviewed).filter(id => reviewed[id]).length.toLocaleString("en-IN"));
}

async function loadHRActionCenter(forceRefresh = false) {
    const tbody = document.getElementById("actionCenterTableBody");
    if (!tbody) return;
    if (actionCenterLoaded && !forceRefresh) { renderActionCenter(); return; }

    tbody.innerHTML = '<tr><td colspan="7" class="action-empty">Loading employee risk analysis...</td></tr>';
    const subtitle = document.getElementById("actionQueueSubtitle");
    if (subtitle) subtitle.textContent = "Requesting risk scores and recommendations from the backend...";

    try {
        const response = await fetch(`${API_BASE_URL}/hr-action-center`);
        if (!response.ok) throw new Error(`HR Action Center API returned HTTP ${response.status}`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error || "HR Action Center request failed");

        await loadActionReviews();
        actionCenterEmployees = Array.isArray(data.employees) ? data.employees : [];
        actionCenterLoaded = true;
        updateActionCenterCounters();
        renderActionCenter();

        const updated = document.getElementById("actionLastUpdated");
        if (updated) updated.textContent = `Updated ${new Date().toLocaleTimeString()}`;
        if (subtitle) subtitle.textContent = `${actionCenterEmployees.length.toLocaleString("en-IN")} employees ranked by model-estimated attrition risk.`;
    } catch (error) {
        console.error("HR Action Center load failed:", error);
        tbody.innerHTML = `<tr><td colspan="7" class="action-empty action-error">Unable to load Action Center. Please check your connection or log in again, then try Refresh.</td></tr>`;
        if (subtitle) subtitle.textContent = "Backend connection required.";
    }
}

function filterActionTable() {
    // Start each new search/filter result from the first 10 matching employees.
    actionCenterVisibleCount = ACTION_CENTER_PAGE_SIZE;
    renderActionCenter();
}

function showMoreActionEmployees() {
    actionCenterVisibleCount += ACTION_CENTER_PAGE_SIZE;
    renderActionCenter();
}

function renderActionCenter() {
    const tbody = document.getElementById("actionCenterTableBody");
    if (!tbody) return;
    const query = (document.getElementById("actionSearch")?.value || "").trim().toLowerCase();
    const riskFilter = (document.getElementById("riskFilter")?.value || "ALL").toUpperCase();
    const statusFilter = (document.getElementById("actionStatusFilter")?.value || "ALL").toUpperCase();
    const reviewedMap = getActionReviewedMap();

    const filtered = actionCenterEmployees.filter(employee => {
        const id = String(employee.employee_number ?? "");
        const reviewed = Boolean(reviewedMap[id]);
        const searchable = [employee.employee_name, id, employee.department, employee.job_role].join(" ").toLowerCase();
        const matchesQuery = !query || searchable.includes(query);
        const matchesRisk = riskFilter === "ALL" || String(employee.risk_level).toUpperCase() === riskFilter;
        const matchesStatus = statusFilter === "ALL" || (statusFilter === "REVIEWED" ? reviewed : !reviewed);
        return matchesQuery && matchesRisk && matchesStatus;
    });

    const visibleEmployees = filtered.slice(0, actionCenterVisibleCount);
    const subtitle = document.getElementById("actionQueueSubtitle");
    if (subtitle) subtitle.textContent = `Showing ${visibleEmployees.length.toLocaleString("en-IN")} of ${filtered.length.toLocaleString("en-IN")} matching employees (${actionCenterEmployees.length.toLocaleString("en-IN")} total).`;
    updateActionCenterCounters();

    const viewMoreWrap = document.getElementById("actionViewMoreWrap");
    const viewMoreButton = document.getElementById("actionViewMoreButton");
    const remaining = Math.max(0, filtered.length - visibleEmployees.length);
    if (viewMoreWrap) viewMoreWrap.style.display = remaining > 0 ? "flex" : "none";
    if (viewMoreButton) viewMoreButton.textContent = remaining > 0
        ? `View more (${remaining.toLocaleString("en-IN")} remaining)`
        : "All employees shown";

    if (!filtered.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="action-empty">No employees match the selected search and filters.</td></tr>';
        return;
    }

    tbody.innerHTML = visibleEmployees.map(employee => {
        const id = String(employee.employee_number);
        const reviewed = Boolean(reviewedMap[id]);
        const level = String(employee.risk_level || "Low").toLowerCase();
        const score = Number(employee.risk_percentage || 0);
        const factors = Array.isArray(employee.factors) ? employee.factors : [];
        const factorMarkup = factors.map(f => `<span class="action-factor">${escapeActionHTML(f)}</span>`).join("");
        return `<tr>
            <td><strong>${escapeActionHTML(employee.employee_name || `Employee #${id}`)}</strong><small class="action-employee-id">EMP-${escapeActionHTML(id)}</small></td>
            <td><strong>${escapeActionHTML(employee.department || "-")}</strong><small class="action-role">${escapeActionHTML(employee.job_role || "-")}</small></td>
            <td><strong class="action-risk-score ${level}">${score.toFixed(1)}%</strong><small class="action-risk-label ${level}">${escapeActionHTML(employee.risk_level || "Unknown")} risk</small></td>
            <td><div class="action-factors">${factorMarkup || '<span class="action-factor">No indicator listed</span>'}</div></td>
            <td class="action-recommendation">${escapeActionHTML(employee.recommendation || "Review with HR.")}</td>
            <td><span class="action-priority ${level}">${escapeActionHTML(employee.priority || "Monitor")}</span></td>
            <td><button type="button" class="action-review-btn ${reviewed ? "reviewed" : ""}" data-employee-id="${escapeActionHTML(id)}" ${reviewed ? "disabled" : ""}>${reviewed ? "✓ Reviewed" : "Mark reviewed"}</button></td>
        </tr>`;
    }).join("");
}

async function markActionReviewed(employeeNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/action-reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ employee_numbers: [Number(employeeNumber)] })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        actionReviewedMap[String(employeeNumber)] = { reviewed: true, reviewedAt: new Date().toISOString() };
    } catch (error) {
        console.error("Could not save review status:", error);
        alert("Could not save review status. Please try again.");
        return;
    }
    updateActionCenterCounters();
    renderActionCenter();
}

function exportActionCenterCSV() {
    const reviewed = getActionReviewedMap();
    const rows = actionCenterEmployees.map(e => [
        e.employee_number, e.employee_name, e.department, e.job_role, e.risk_percentage, e.risk_level,
        (e.factors || []).join("; "), e.recommendation, e.priority,
        reviewed[String(e.employee_number)] ? "Reviewed" : "Pending"
    ]);
    const headers = ["EmployeeNumber", "EmployeeName", "Department", "JobRole", "RiskPercentage", "RiskLevel", "RiskIndicators", "RecommendedAction", "Priority", "ReviewStatus"];
    const csv = [headers, ...rows].map(row => row.map(value => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "hr_action_center_queue.csv";
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}

document.addEventListener("click", function (event) {
    const reviewButton = event.target.closest(".action-review-btn");
    if (reviewButton && !reviewButton.disabled) markActionReviewed(reviewButton.dataset.employeeId);
});

document.getElementById("refreshActionCenter")?.addEventListener("click", () => { actionCenterVisibleCount = ACTION_CENTER_PAGE_SIZE; loadHRActionCenter(true); });
document.getElementById("actionViewMoreButton")?.addEventListener("click", showMoreActionEmployees);
document.getElementById("exportActionCenter")?.addEventListener("click", exportActionCenterCSV);
document.querySelector('a[href="#action-center"]')?.addEventListener("click", () => loadHRActionCenter());

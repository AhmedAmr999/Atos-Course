const API_ENDPOINT = "http://localhost:3122/exams/examDefinition";

export async function getAllExams() {
  const responseData = await fetch(`${API_ENDPOINT}`);
  const jsonData = await responseData.json();
  return jsonData;
}

export async function addExam(examInfo, questions_ids) {
  try {
    const response = await fetch(`${API_ENDPOINT}/addExam`, {
      method: "POST",
      body: JSON.stringify({
        ...examInfo,
        questions_ids: questions_ids,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}


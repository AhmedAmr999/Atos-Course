const API_ENDPOINT = "http://localhost:3122/exams/examIntsance";

export async function getAllExamInstances() {
  const responseData = await fetch(`${API_ENDPOINT}`);
  const jsonData = await responseData.json();
  return jsonData;
}

export async function addExamInstance(
  examDefinition_id,
  startedtime,
  endtime,
  takenby_ids,
  createdby,
  status,
  questions_ids,
  generated_link,
  token
) {
  try {
    const response = await fetch(`${API_ENDPOINT}/addExamInsatnce`, {
      method: "POST",
      body: JSON.stringify({
        examDefinition_id: examDefinition_id,
        startedtime: startedtime,
        endtime: endtime,
        takenby_ids: takenby_ids,
        createdby: createdby,
        status: status,
        questions: questions_ids,
        generated_link: generated_link,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getUserExamIntsance() {
  try {
    const responseData = await fetch(
      `${API_ENDPOINT}/${localStorage.getItem("userId")}/generatedLinks`
    );
    console.log(responseData);
    const jsonData = responseData.json();
    console.log(jsonData);
  } catch (error) {
    console.log(error);
    return error;
  }
}

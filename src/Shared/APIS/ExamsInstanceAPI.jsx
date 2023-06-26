const API_ENDPOINT = "http://localhost:3122/exams/examIntsance";
const NOTIFICATION_API_ENDPOINT = "http://localhost:3456/notifications";

export async function getAllExamInstances() {
  const responseData = await fetch(`${API_ENDPOINT}`);
  const jsonData = await responseData.json();
  return jsonData;
}

export async function addExamInstance(
  examdefinition_id,
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
        examdefinition_id: examdefinition_id,
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
    let data = await response.json();

    if (response.ok) {
      if (data.message === "Exam already assigned to this user") {
        return data.message;
      } else {
        let examDefinitionId = data.examdefinition_id;
        let examInstanceId = data.examinstance_id;
        let studentId = data.takenby_ids;
        let startExamTime = data.startedtime;
        let examDefinitionName;

        try {
          const anotherURL = await fetch(
            `http://localhost:3122/exams/examIntsance/${studentId}/generatedLinks/examDefinitionId/${examDefinitionId}`
          );
          if (anotherURL.ok) {
            const jsonData = await anotherURL.json();
            examInstanceId = jsonData.examInsatnceId[0].examinstance_id;
            examDefinitionName = jsonData.examDefinitionName;
          }
        } catch (error) {
          console.log("could not get examDefinitionName ", error);
        }

        try {
          await postNotification(
            examDefinitionName,
            examDefinitionId,
            examInstanceId,
            generated_link,
            studentId,
            createdby,
            startExamTime
          );
        } catch (error) {
          console.log("error in adding Notification ", error);
        }

        return data;
      }
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
    const jsonData = responseData.json();
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function postNotification(
  examDefinitionName,
  examdefinition_id,
  examinstance_id,
  generated_link,
  studentId,
  creatorId,
  startedtime
) {
  try {
    const responseData = await fetch(
      `http://localhost:3456/notifications/addNotification`,
      {
        method: "POST",
        body: JSON.stringify({
          examDefinitionName: examDefinitionName,
          examdefinition_id: examdefinition_id,
          examinstance_id: examinstance_id,
          generated_link: generated_link,
          studentId: studentId,
          creatorId: creatorId,
          startedtime: startedtime,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await responseData.json();

    if (data.message === "notification Created Successfully") {
      console.log("the notification is added Successfully");
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getUserExamInstances(userId, examDefinitionId) {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/${userId}/generatedLinks/examDefinitionId/${examDefinitionId}`
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Failed to fetch exam instances: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Failed to fetch exam instances: ${error}`);
  }
}

export async function getSingleExam(examInsatnceId) {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/singleExamInstance/${examInsatnceId}`
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Failed to fetch exam instances: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Failed to fetch exam instances: ${error}`);
  }
}

export async function deleteExamInstanceAndNotification(examInstanceId) {
  try {
    const notificationResponse = await fetch(
      `${NOTIFICATION_API_ENDPOINT}/deleteNotification/${examInstanceId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const notificationData = await notificationResponse.json();

    if (
      notificationResponse.ok &&
      notificationData.message === "Notification Deleted Successfully"
    ) {
      try {
        const examInstanceResponse = await fetch(
          `${API_ENDPOINT}/${examInstanceId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const examInstanceData = await examInstanceResponse.json();

        if (
          examInstanceResponse.ok &&
          examInstanceData.message === "Exam Instance Deleted Successfully"
        ) {
          return;
        }
      } catch (error) {
        console.error("Error deleting Exam Instance:", error);
      }
    }
  } catch (error) {
    console.error("Error deleting Notification:", error);
  }
}

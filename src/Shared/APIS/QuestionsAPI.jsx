const API_ENDPOINT = "http://localhost:3000/questions";

export async function getAllQuestions() {
  const responseData = await fetch(`${API_ENDPOINT}`);
  const jsonData = await responseData.json();
  return jsonData.questions;
}

export async function fetchAnswers(questionId) {
  const responseData = await fetch(`${API_ENDPOINT}/${questionId}/Answers`);
  const jsonData = await responseData.json();
  return jsonData.answers[0];
}

export async function deleteQuestionAndAnswers(questionId) {
  await fetch(`${API_ENDPOINT}/deleteQuestion/${questionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function addQuestion(questionInfo, answers, correctAnswers) {
  try {
    const response = await fetch(`${API_ENDPOINT}/addQuestion`, {
      method: "POST",
      body: JSON.stringify({
        ...questionInfo,
        answers: answers,
        correctAnswers: correctAnswers,
        creatorId: localStorage.getItem("userId"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.message === "success") {
      window.location.href = "/users/profileInfo";
      alert("Question Added Successfully");
    } else {
      window.location.href = "/";
      alert("Please check your credentials");
    }
  } catch (error) {
    console.log(error);
  }
}

export const updateQuestion = async (
  questionId,
  updatedQuestion,
  userId,
  updatedAnswers,
  updatedCorrectAnswers
) => {
  const filteredAnswers = updatedAnswers.filter((answer) => answer !== "");

  const response = await fetch(`${API_ENDPOINT}/updateQuestion/${questionId}`, {
    method: "PATCH",
    body: JSON.stringify({
      ...updatedQuestion,
      creatorId: userId,
      answers: filteredAnswers,
      correctAnswers: updatedCorrectAnswers,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const jsonData = await response.json();
  if (jsonData) {
    return true;
  } else {
    throw new Error("Failed to update question");
  }
};

export async function fetchSingleQuestion(questionId) {
  const responseData = await fetch(`${API_ENDPOINT}/${questionId}`);
  const jsonData = await responseData.json();
  if (jsonData.message === "Found Question Successfully") {
    console.log(jsonData.question);
    return jsonData.question;
  } else {
    throw new Error("Could not find question");
  }
}

export async function deleteSingleAnswer(answerId) {
  try {
    const response = await fetch(`${API_ENDPOINT}/deleteAnswer/${answerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("the respone from the API is ", response);
    if (response.ok) {
      const data = await response.json();
      return data.message === "Answer deleted successfully";
    } else {
      throw new Error("Failed to delete answer");
    }
  } catch (error) {
    console.log("Error deleting answer:", error);
    throw error;
  }
}

export async function fetchSingleAnswer(answerId) {
  const responseData = await fetch(`${API_ENDPOINT}/Answer/${answerId}`);
  const jsonData = await responseData.json();
  if (jsonData.message === "Found answer Successfully") {
    console.log("Found answer Successfully", jsonData.answer);
    return jsonData.answer;
  } else {
    throw new Error("Could not find question");
  }
}

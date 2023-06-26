import React, { useEffect, useState } from "react";
import {
  deleteExamInstanceAndNotification,
  getSingleExam,
  getUserExamInstances,
} from "../../Shared/APIS/ExamsInstanceAPI";
import { useParams } from "react-router-dom";
import { newGetUserInfo } from "../../Shared/APIS/AuthenticationAPI";
import Card from "../../Shared/Components/Card";
import Input from "../../Shared/Components/Input";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const SingleExamInstance = () => {
  const { examInsatnceId } = useParams();
  const [examInstance, setExamInstance] = useState("");
  const [takenByStudent, setTakenByStudent] = useState("");
  const [examDefinitionName, setExamDefinitionName] = useState("");
  const history = useHistory();

  useEffect(() => {
    const getSingleExm = async () => {
      const response = await getSingleExam(examInsatnceId);
      setExamInstance(response);
    };

    getSingleExm();
  }, [examInsatnceId]);

  useEffect(() => {
    const getStudentUserName = async () => {
      if (examInstance && examInstance.takenby_ids) {
        const response = await newGetUserInfo(examInstance.takenby_ids);
        const username = response.user[0].username;
        setTakenByStudent(username);
      }
    };
    getStudentUserName();
  }, [examInstance]);

  useEffect(() => {
    const getExamDefinitionName = async () => {
      if (examInstance && examInstance.examdefinition_id) {
        const response = await getUserExamInstances(
          localStorage.getItem("userId"),
          examInstance.examdefinition_id
        );
        setExamDefinitionName(response.examDefinitionName);
      }
    };

    getExamDefinitionName();
  }, [examInstance]);

  const handleDelete = async (examInstanceId) => {
    try {
      await deleteExamInstanceAndNotification(examInstanceId);
      alert("Exam Instance Deleted Successfully");
      history.push("/examInstances/getAll");
    } catch (error) {}
  };

  return (
    <div>
      {examInstance && (
        <div>
          <h3 style={{ alignItems: "center" }}>
            {examInstance.examDefinitionName}
          </h3>
          <Card>
            {examInstance.createdby === localStorage.getItem("userId") ? (
              <>
                <Input
                  element="text"
                  type="text"
                  label="studentName:"
                  value={takenByStudent}
                  disabled
                />
                <Input
                  element="text"
                  type="text"
                  label="StudentGrade:"
                  value={examInstance.studentgrade}
                  disabled
                />
                <Input
                  element="text"
                  type="text"
                  label="StudentStatus:"
                  value={examInstance.status}
                  disabled
                />
                <Input
                  element="text"
                  type="text"
                  label="StudentScore:"
                  value={examInstance.studentscore}
                  disabled
                />
                <button
                  onClick={() => handleDelete(examInstance.examinstance_id)}
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <p>StudentGrade: {examInstance.studentgrade}</p>
                <p>StudentStatus: {examInstance.status}</p>
                <p>StudentScore: {examInstance.studentscore}</p>
                <p>StudentName: {takenByStudent}</p>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default SingleExamInstance;

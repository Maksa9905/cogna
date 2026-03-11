const subjectFields = `
  id
  userId
  title
  createdAt
  updatedAt
`;

export const subjectFindAllQueryDocument = `
  query SubjectFindAll($data: FindAllSubjectsRequestGql!) {
    subjectFindAll(data: $data) {
      subjects {
        ${subjectFields}
      }
    }
  }
`;

export const subjectFindOneQueryDocument = `
  query SubjectFindOne($data: FindOneSubjectRequestGql!) {
    subjectFindOne(data: $data) {
      subject {
        ${subjectFields}
      }
    }
  }
`;

export const subjectCreateSubjectMutationDocument = `
  mutation SubjectCreateSubject($data: CreateSubjectRequestGql!) {
    subjectCreateSubject(data: $data) {
      subject {
        ${subjectFields}
      }
    }
  }
`;

export const subjectUpdateSubjectMutationDocument = `
  mutation SubjectUpdateSubject($data: UpdateSubjectRequestGql!) {
    subjectUpdateSubject(data: $data) {
      subject {
        ${subjectFields}
      }
    }
  }
`;

export const subjectDeleteSubjectMutationDocument = `
  mutation SubjectDeleteSubject($data: DeleteSubjectRequestGql!) {
    subjectDeleteSubject(data: $data) {
      ok
    }
  }
`;

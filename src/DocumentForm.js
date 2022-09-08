import React, { useRef, useState } from "react";
import { Col, Container, Row, Form, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import uniqid from "uniqid";
import * as Yup from "yup";
import { serialize } from "object-to-formdata";
import { apiCaller } from "./apiCaller";

function validateAll(items) {
  let allValid = true;
  items.forEach((item) => {
    if (!item.fileName) {
      item.fileNameErr = "Required";
      allValid = false;
    }
    if (!item.fileType) {
      item.fileTypeErr = "Required";
      allValid = false;
    }
    if (!item.fileUpload) {
      item.fileUploadErr = "Required";
      allValid = false;
    }
    if (item.fileUpload && item.fileType) {
      if (!item.fileUpload.type.includes(item.fileType)) {
        item.fileUploadErr = "Invalid file type";
        allValid = false;
      }
    }
  });
  return allValid;
}

function validateMe(item, id) {
  if (!item.fileName) {
    item.fileNameErr = "Required";
  } else {
    delete item.fileNameErr;
  }
  if (!item.fileType) {
    item.fileTypeErr = "Required";
  } else {
    delete item.fileTypeErr;
  }
  if (!item.fileUpload) {
    item.fileUploadErr = "Required";
  } else {
    delete item.fileUploadErr;
  }
  if (item.fileUpload && item.fileType) {
    if (!item.fileUpload.type.includes(item.fileType)) {
      item.fileUploadErr = "Invalid file type";
    } else {
      delete item.fileUploadErr;
    }
  }
}

const DocumentForm = () => {
  const [fields, setFields] = useState([
    {
      isRemoveable: false,
      fieldSetId: uniqid("fieldset-"),
      fileName: "",
      fileType: "",
      fileUpload: null,
    },
  ]);
  const pAddressS1Ref = useRef(null);
  const pAddressS2Ref = useRef(null);

  const handleAddfield = () => {
    setFields((prev) => [
      ...prev,
      {
        isRemoveable: true,
        fieldSetId: uniqid("fieldset-"),
        fileName: "",
        fileType: "",
        fileUpload: null,
      },
    ]);
  };

  const handleDeletefield = (id) => {
    setFields((prev) => prev.filter((item) => item.fieldSetId !== id));
  };

  const handleDocumentUpload = (event, id, key) => {
    const item = fields.find((item) => item.fieldSetId === id);
    item[key] =
      key !== "fileUpload"
        ? event.target.value
        : event.currentTarget.files[0] || null;
    validateMe(item, id);
    setFields((prev) => [...prev]);
  };

  return (
    <>
      <div className="document_form">
        <div className="document_form_wrapper">
          <Container>
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                dateOfBirth: "",
                cAddressS1: "",
                cAddressS2: "",
                isPermanentCurrentAdd: 0,
                pAddressS1: "",
                pAddressS2: "",
              }}
              validate={() => {
                let errors = {};
                const isValid = validateAll(fields, setFields);
                if (!isValid) errors.notAllValid = "fields are not valid";
                return errors;
              }}
              validationSchema={Yup.object().shape({
                firstName: Yup.string().required("Required"),
                lastName: Yup.string().required("Required"),
                email: Yup.string().email("Invalid Email").required("Required"),
                dateOfBirth: Yup.string().required("Required"),
                cAddressS1: Yup.string().required("Required"),
                cAddressS2: Yup.string().required("Required"),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const serializeData = serialize(
                    {
                      ...values,
                      docName: fields.map((item) => item.fileName),
                      docType: fields.map((item) => item.fileType),
                      document: fields.map((item) => item.fileUpload),
                    },
                    { indices: true }
                  );
                  const data = await apiCaller(
                    "/user/document-submit",
                    "post",
                    serializeData
                  );
                  console.log(data);
                  alert(data.message);
                  setSubmitting(false);
                } catch (error) {
                  console.log(error);
                  alert(error.data.message);
                  setSubmitting(false);
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                isSubmitting,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Row className="gy-5">
                    <Col xs={12} className="text-center">
                      <h2>Please fill all details given below</h2>
                    </Col>
                    <Col xs={12}>
                      <Row>
                        <Col xs={12} lg={6}>
                          <Form.Group className="mb-4" controlId="firstName">
                            <Form.Label className="required_field">
                              <b>First Name</b>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              value={values.firstName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Enter your first name here..."
                              isInvalid={touched.firstName && errors.firstName}
                            />
                            {Boolean(touched.firstName && errors.firstName) && (
                              <Form.Control.Feedback type="invalid">
                                {errors.firstName}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                          <Form.Group className="mb-4" controlId="lastName">
                            <Form.Label className="required_field">
                              <b>Last Name</b>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              value={values.lastName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Enter your last name here..."
                              isInvalid={touched.lastName && errors.lastName}
                            />
                            {Boolean(touched.lastName && errors.lastName) && (
                              <Form.Control.Feedback type="invalid">
                                {errors.lastName}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} lg={6}>
                          <Form.Group className="mb-4" controlId="email">
                            <Form.Label className="required_field">
                              <b>E-mail</b>
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="ex: myname@example.com"
                              isInvalid={touched.email && errors.email}
                            />
                            {Boolean(touched.email && errors.email) && (
                              <Form.Control.Feedback type="invalid">
                                {errors.email}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                          <Form.Group className="mb-4" controlId="dateOfBirth">
                            <Form.Label className="required_field">
                              <b>Date of Birth</b>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="dateOfBirth"
                              onChange={(event) =>
                                setFieldValue("dateOfBirth", event.target.value)
                              }
                              placeholder="Date of Birth"
                              className="mb-2"
                              isInvalid={errors.dateOfBirth}
                            />
                            <Form.Text className="text-muted">
                              (Min. age should be 18 years)
                            </Form.Text>
                            {Boolean(touched.email && errors.email) && (
                              <Form.Control.Feedback type="invalid">
                                {errors.email}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <p>
                          <b>Residential Address</b>
                        </p>
                        <Col xs={12} lg={6}>
                          <Form.Group className="mb-4" controlId="cAddressS1">
                            <Form.Label className="required_field">
                              Street 1
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="cAddressS1"
                              value={values.cAddressS1}
                              onChange={(event) => {
                                handleChange(event);
                                if (values.isPermanentCurrentAdd) {
                                  setFieldValue(
                                    "pAddressS1",
                                    event.target.value
                                  );
                                }
                              }}
                              onBlur={handleBlur}
                              isInvalid={
                                touched.cAddressS1 && errors.cAddressS1
                              }
                            />
                            {Boolean(
                              touched.cAddressS1 && errors.cAddressS1
                            ) && (
                              <Form.Control.Feedback type="invalid">
                                {errors.cAddressS1}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                          <Form.Group className="mb-4" controlId="cAddressS2">
                            <Form.Label className="required_field">
                              Street 2
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="cAddressS2"
                              value={values.cAddressS2}
                              onChange={(event) => {
                                handleChange(event);
                                if (values.isPermanentCurrentAdd) {
                                  setFieldValue(
                                    "pAddressS2",
                                    event.target.value
                                  );
                                }
                              }}
                              onBlur={handleBlur}
                              isInvalid={
                                touched.cAddressS2 && errors.cAddressS2
                              }
                            />
                            {Boolean(
                              touched.cAddressS2 && errors.cAddressS2
                            ) && (
                              <Form.Control.Feedback type="invalid">
                                {errors.cAddressS2}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Form.Group
                            className="mb-4"
                            controlId="isPermanentCurrentAdd"
                          >
                            <Form.Check
                              type="checkbox"
                              label="Same as Residential Address"
                              onChange={(event) => {
                                setFieldValue(
                                  "isPermanentCurrentAdd",
                                  +event.target.checked
                                );
                                if (event.target.checked) {
                                  setFieldValue(
                                    "pAddressS1",
                                    values.cAddressS1
                                  );
                                  setFieldValue(
                                    "pAddressS2",
                                    values.cAddressS2
                                  );
                                  pAddressS1Ref.current.disabled = true;
                                  pAddressS2Ref.current.disabled = true;
                                } else {
                                  pAddressS1Ref.current.disabled = false;
                                  pAddressS2Ref.current.disabled = false;
                                }
                              }}
                              checked={Boolean(values.isPermanentCurrentAdd)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <p>
                          <b>Permanent Address</b>
                        </p>
                        <Col xs={12} lg={6}>
                          <Form.Group className="mb-4" controlId="pAddressS1">
                            <Form.Label>Street 1</Form.Label>
                            <Form.Control
                              ref={pAddressS1Ref}
                              type="text"
                              name="pAddressS1"
                              value={values.pAddressS1}
                              onChange={(event) => {
                                if (!values.isPermanentCurrentAdd) {
                                  handleChange(event);
                                }
                              }}
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                          <Form.Group className="mb-4" controlId="pAddressS2">
                            <Form.Label>Street 2</Form.Label>
                            <Form.Control
                              ref={pAddressS2Ref}
                              type="text"
                              name="pAddressS2"
                              value={values.pAddressS2}
                              onChange={(event) => {
                                if (!values.isPermanentCurrentAdd) {
                                  handleChange(event);
                                }
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <p>
                          <b>Upload Documents</b>
                        </p>
                        {fields.map(
                          ({
                            isRemoveable,
                            fieldSetId,
                            fileNameErr,
                            fileTypeErr,
                            fileUploadErr,
                          }) => (
                            <Row
                              className="align-items-center"
                              key={fieldSetId}
                            >
                              <Col xs={10}>
                                <Row>
                                  <Col xs={12} lg={4}>
                                    <Form.Group
                                      className="mb-4"
                                      controlId="fileName"
                                    >
                                      <Form.Label className="required_field">
                                        File Name
                                      </Form.Label>
                                      <Form.Control
                                        type="text"
                                        name="fileName"
                                        onChange={(event) =>
                                          handleDocumentUpload(
                                            event,
                                            fieldSetId,
                                            "fileName"
                                          )
                                        }
                                        isInvalid={Boolean(fileNameErr)}
                                      />
                                      {Boolean(fileNameErr) && (
                                        <Form.Control.Feedback type="invalid">
                                          {fileNameErr}
                                        </Form.Control.Feedback>
                                      )}
                                    </Form.Group>
                                  </Col>
                                  <Col xs={12} lg={4}>
                                    <Form.Group
                                      className="mb-4"
                                      controlId="fileType"
                                    >
                                      <Form.Label className="required_field">
                                        File Type
                                      </Form.Label>
                                      <Form.Select
                                        onChange={(event) =>
                                          handleDocumentUpload(
                                            event,
                                            fieldSetId,
                                            "fileType"
                                          )
                                        }
                                        isInvalid={Boolean(fileTypeErr)}
                                      >
                                        <option value="">File type</option>
                                        <option value="image">Image</option>
                                        <option value="pdf">PDF</option>
                                      </Form.Select>
                                      <Form.Text className="text-muted">
                                        (Image, pdf.)
                                      </Form.Text>
                                      {Boolean(fileTypeErr) && (
                                        <Form.Control.Feedback type="invalid">
                                          {fileTypeErr}
                                        </Form.Control.Feedback>
                                      )}
                                    </Form.Group>
                                  </Col>
                                  <Col xs={12} lg={4}>
                                    <Form.Group
                                      className="mb-4"
                                      controlId="fileUpload"
                                    >
                                      <Form.Label className="required_field">
                                        Upload Document
                                      </Form.Label>
                                      <Form.Control
                                        type="file"
                                        accept="image/jpeg,image/gif,image/png,application/pdf"
                                        onChange={(event) =>
                                          handleDocumentUpload(
                                            event,
                                            fieldSetId,
                                            "fileUpload"
                                          )
                                        }
                                        name="fileUpload"
                                        isInvalid={Boolean(fileUploadErr)}
                                      />
                                      {Boolean(fileUploadErr) && (
                                        <Form.Control.Feedback type="invalid">
                                          {fileUploadErr}
                                        </Form.Control.Feedback>
                                      )}
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col xs={2}>
                                {!isRemoveable ? (
                                  <button
                                    type="button"
                                    className="add_btn"
                                    onClick={handleAddfield}
                                  >
                                    <i className="bi bi-plus"></i>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="remove_btn"
                                    onClick={() =>
                                      handleDeletefield(fieldSetId)
                                    }
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                )}
                              </Col>
                            </Row>
                          )
                        )}
                      </Row>
                      <Form.Group className="mt-3 text-center">
                        <button type="submit" disabled={isSubmitting}>
                          Submit{" "}
                          {isSubmitting ? (
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          ) : null}
                        </button>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Container>
        </div>
      </div>
    </>
  );
};

export default DocumentForm;

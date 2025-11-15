<template>
  <Form @submit="submitPublisher" :validation-schema="publisherFormSchema">
    <div class="form-group">
      <label for="tenNXB">Tên Nhà xuất bản</label>
      <Field
        name="tenNXB"
        type="text"
        class="form-control"
        v-model="publisherLocal.tenNXB"
      />
      <ErrorMessage name="tenNXB" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="diaChi">Địa chỉ</label>
      <Field
        name="diaChi"
        type="text"
        class="form-control"
        v-model="publisherLocal.diaChi"
      />
      <ErrorMessage name="diaChi" class="error-feedback" />
    </div>

    <div class="form-group d-flex gap-3 mt-3">
      <button class="btn btn-primary">
        <i class="fa-solid fa-floppy-disk"></i> Lưu
      </button>
      <button
        v-if="publisherLocal._id"
        type="button"
        class="ml-2 btn btn-danger"
        @click="deletePublisher"
      >
        <i class="fa-solid fa-trash"></i> Xoá
      </button>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:publisher", "delete:publisher"],
  props: {
    publisher: { type: Object, required: true },
  },
  data() {
    const publisherFormSchema = yup.object().shape({
      tenNXB: yup
        .string()
        .required("Tên phải có giá trị.")
        .matches(/Nhà xuất bản/, "Tên phải có chữ Nhà xuất bản.")
        .min(15, "Tên phải ít nhất 15 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),
      diaChi: yup
        .string()
        .required("Địa chỉ phải có giá trị")
        .max(100, "Địa chỉ tối đa 100 ký tự."),
    });
    return {
      publisherLocal: this.publisher,
      publisherFormSchema,
    };
  },
  methods: {
    submitPublisher() {
      this.$emit("submit:publisher", this.publisherLocal);
    },
    deletePublisher() {
      this.$emit("delete:publisher", this.publisherLocal.id);
    },
  },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>

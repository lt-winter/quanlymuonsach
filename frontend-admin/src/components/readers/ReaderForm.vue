<template>
  <Form @submit="submitReader" :validation-schema="readerFormSchema">
    <div class="form-group">
      <label for="hoLot">Họ và tên lót</label>
      <Field
        name="hoLot"
        type="text"
        class="form-control"
        v-model="readerLocal.hoLot"
      />
      <ErrorMessage name="hoLot" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="ten">Tên</label>
      <Field
        name="ten"
        type="text"
        class="form-control"
        v-model="readerLocal.ten"
      />
      <ErrorMessage name="ten" class="error-feedback" />
    </div>

    <div class="form-group position-relative" ref="genderDropdown">
      <label for="phai">Phái</label>
      <Field name="phai" v-slot="{ field }">
        <input
          type="text"
          class="form-control"
          placeholder="Chọn phái..."
          :value="genderDisplay"
          readonly
          @focus="showGenderDropdown = true"
          @click.stop="showGenderDropdown = true"
        />
        <div
          v-if="showGenderDropdown"
          class="list-group position-absolute w-100 mt-1 shadow-sm"
          style="max-height: 200px; overflow-y: auto; z-index: 10"
        >
          <button
            v-for="option in genderOptions"
            :key="option.value"
            type="button"
            class="list-group-item list-group-item-action"
            :class="{ active: option.value === readerLocal.phai }"
            @click="
              () => {
                readerLocal.phai = option.value;
                field.onChange(option.value);
                showGenderDropdown = false;
              }
            "
          >
            {{ option.label }}
          </button>
        </div>
      </Field>
      <ErrorMessage name="phai" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="ngaySinh">Ngày sinh</label>
      <Field
        name="ngaySinh"
        type="date"
        class="form-control"
        v-model="readerLocal.ngaySinh"
        :max="today"
      />
      <ErrorMessage name="ngaySinh" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="diaChi">Địa chỉ</label>
      <Field
        name="diaChi"
        type="text"
        class="form-control"
        v-model="readerLocal.diaChi"
      />
      <ErrorMessage name="diaChi" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="dienThoai">Điện thoại</label>
      <Field
        name="dienThoai"
        type="tel"
        class="form-control"
        v-model="readerLocal.dienThoai"
      />
      <ErrorMessage name="dienThoai" class="error-feedback" />
    </div>

    <div class="form-group d-flex mt-3">
      <button class="btn btn-primary">
        <i class="fa-solid fa-floppy-disk"></i> Lưu
      </button>
      <button
        v-if="readerLocal._id"
        type="button"
        class="ml-2 btn btn-danger"
        @click="deleteReader"
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
  emits: ["submit:reader", "delete:reader"],
  props: {
    reader: { type: Object, required: true },
  },
  data() {
    const readerFormSchema = yup.object().shape({
      hoLot: yup
        .string()
        .required("Họ và tên lót phải có giá trị.")
        .min(2, "Họ và tên lót phải ít nhất 2 ký tự.")
        .max(50, "Họ và tên lót có nhiều nhất 50 ký tự."),
      ten: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),
      phai: yup
        .string()
        .required("Phải chọn phái.")
        .notOneOf([""], "Phải chọn phái."),
      ngaySinh: yup
        .date()
        .required("Ngày sinh là bắt buộc.")
        .max(new Date(), "Ngày sinh không được lớn hơn ngày hiện tại."),
      diaChi: yup
        .string()
        .required("Địa chỉ phải có giá trị")
        .max(100, "Địa chỉ tối đa 100 ký tự."),
      dienThoai: yup
        .string()
        .required("Số điện thoại phải có giá trị.")
        .matches(
          /((09|03|07|08|05)+([0-9]{8})\b)/g,
          "Số điện thoại không hợp lệ."
        ),
    });
    return {
      readerLocal: this.reader,
      readerFormSchema,
      showGenderDropdown: false,
      today: new Date().toISOString().split('T')[0],
      genderOptions: [
        { value: "Nam", label: "Nam" },
        { value: "Nữ", label: "Nữ" },
        { value: "Khác", label: "Khác" },
      ],
    };
  },
  computed: {
    genderDisplay() {
      const option = this.genderOptions.find(
        (o) => o.value === this.readerLocal.phai
      );
      return option ? option.label : "";
    },
  },
  methods: {
    submitReader() {
      this.$emit("submit:reader", this.readerLocal);
    },
    deleteReader() {
      this.$emit("delete:reader", this.readerLocal.id);
    },
    handleClickOutside(event) {
      const dropdown = this.$refs.genderDropdown;
      if (dropdown && !dropdown.contains(event.target)) {
        this.showGenderDropdown = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>

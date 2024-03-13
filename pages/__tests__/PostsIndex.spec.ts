// @vitest-environment nuxt
import { describe, it, expect } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { mount, flushPromises } from "@vue/test-utils";
import { usePostStore } from "@/stores/posts";
import PostIndex from "../admin/posts/index.vue";
import formKitConfig from "@/formkit.config";

describe("Category CRUD", async () => {
  const wrapper = mount(PostIndex, {
    global: {
      plugins: [createTestingPinia(), formKitConfig],
    },
  });

  await flushPromises();

  const store = usePostStore();
  it("renders the page correctly and calls the store.fetchPosts", async () => {
    // Debugging statement
    //console.log("html - " + wrapper.html());
    expect(wrapper.exists()).toBe(true);

    const searchData = {
      rowsPerPage: 5,
      searchName: "",
      searchStatus: "",
    };

    await wrapper.vm.$nextTick();

    expect(store.fetchPosts).toHaveBeenCalledWith(1, searchData);
  });

  it("it should have search fields", () => {
    // Assert presence of search fields by data-testId
    const searchNameInput = wrapper.find('[data-testId="search-name"]');
    const searchStatusSelect = wrapper.find('[data-testId="search-status"]');
    const rowsPerPageSelect = wrapper.find('[data-testId="rows-per-page"]');

    // Assert presence of search name input field
    expect(searchNameInput.exists()).toBe(true);
    expect(searchNameInput.attributes("type")).toBe("text");
    expect(searchNameInput.attributes("name")).toBe("name");

    // Assert presence of search status select field
    expect(searchStatusSelect.exists()).toBe(true);
    expect(searchStatusSelect.element.tagName.toLowerCase()).toBe("select");

    // Assert presence of rows per page select field
    expect(rowsPerPageSelect.exists()).toBe(true);
    expect(rowsPerPageSelect.element.tagName.toLowerCase()).toBe("select");
  });

  it('it should only have "Draft" and "Published" options in the status select', () => {
    const select = wrapper.find('[data-testId="search-status"]'); // Assuming only one select element is present
    const options = select.findAll("option");

    // Check if the number of options is 3 (including the default empty option)
    expect(options.length).toBe(3);

    // Check if the options contain "Draft" and "Published" values
    expect(options[1].text()).toBe("Draft");
    expect(options[2].text()).toBe("Published");
  });

  it("it should only have 5,10,15,20,25 options in the entries per page select option", () => {
    const select = wrapper.find('[data-testId="rows-per-page"]');
    const options = select.findAll("option");

    // Check if the select element has the data-testId attribute
    expect(select.exists()).toBe(true);

    // Check if the options are present with the correct values
    expect(options.length).toBe(5); // Expecting 5 options
    expect(options[0].text()).toBe("5");
    expect(options[1].text()).toBe("10");
    expect(options[2].text()).toBe("15");
    expect(options[3].text()).toBe("20");
    expect(options[4].text()).toBe("25");
  });

  it("it should call watch with updated searchData", async () => {
    const searchData = {
      rowsPerPage: 5,
      searchName: "",
      searchStatus: "",
    };

    // Simulate user input to the fields
    const searchNameInput = wrapper.find('[data-testId="search-name"]');
    const searchName = "Test Search Name";
    await searchNameInput.setValue(searchName);
    searchData.searchName = searchName;

    // Ensure watch is called with updated searchData
    expect(store.fetchPosts).toHaveBeenCalledWith(1, searchData);

    // Ensure debouncedSearch is called after debounce time
    await new Promise((resolve) => setTimeout(resolve, 300));

    const searchStatusSelect = wrapper.find('[data-testId="search-status"]');
    const searchStatus = "published";
    await searchStatusSelect.setValue("published");
    searchData.searchStatus = searchStatus;

    // Ensure watch is called with updated searchData
    expect(store.fetchPosts).toHaveBeenCalledWith(1, searchData);

    // Ensure debouncedSearch is called after debounce time
    await new Promise((resolve) => setTimeout(resolve, 300));

    const rowsPerPageSelect = wrapper.find('[data-testId="rows-per-page"]');
    const rowsPerPage = "10";
    await rowsPerPageSelect.setValue(rowsPerPage);

    expect(store.fetchPosts).toHaveBeenCalledTimes(3);
    // Ensure watch is called with updated searchData
    expect(store.fetchPosts).toHaveBeenCalledWith(1, {
      rowsPerPage: "10",
      searchName: "Test Search Name",
      searchStatus: "published",
    });
  });
});

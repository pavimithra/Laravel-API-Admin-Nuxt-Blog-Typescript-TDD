// @vitest-environment nuxt
import { describe, test, expect } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { mount, flushPromises } from "@vue/test-utils";
import { usePostStore } from "@/stores/posts";
import DataTable from "../admin/posts/DataTable.vue";
// @ts-ignore
import { TailwindPagination } from "laravel-vue-pagination";

describe("Posts DataTable Testing with No Data", async () => {
  const wrapper = mount(DataTable, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            post: {
              posts: {
                data: [],
                links: {
                  first: "#",
                  last: "#",
                  prev: null,
                  next: null,
                },
                meta: {
                  current_page: 1,
                  from: null,
                  last_page: 1,
                  links: [
                    {
                      url: null,
                      label: "&laquo; Previous",
                      active: false,
                    },
                    {
                      url: "#",
                      label: "1",
                      active: true,
                    },
                    {
                      url: null,
                      label: "Next &raquo;",
                      active: false,
                    },
                  ],
                  path: "#",
                  per_page: 5,
                  to: null,
                  total: 0,
                },
              },
            },
          },
        }),
      ],
    },
    props: {
      searchData: {
        rowsPerPage: 5,
        searchName: "",
        searchStatus: "",
      },
    },
  });

  await flushPromises(); // Wait for asynchronous operations to complete

  test("Displays no Posts Found inside the tbody", () => {
    // Assert that the component renders correctly
    expect(wrapper.exists()).toBe(true);

    // Assert that the table is rendered
    const table = wrapper.find("table");
    expect(table.exists()).toBe(true);

    // Assert that the table headers are rendered
    const tableHeaders = table.findAll("thead th");
    expect(tableHeaders.length).toBe(5); // Ensure correct number of headers

    // Assert that the "No posts Found" message is displayed
    const noPostsMessage = wrapper.find('tbody > tr > td[colspan="5"]');
    expect(noPostsMessage.exists()).toBe(true);
    expect(noPostsMessage.text()).toContain("No posts Found");
  });
});

describe("Posts DataTable Testing with Sample Data for 2 Pages", async () => {
  const wrapper = mount(DataTable, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            post: {
              selectedPosts: [],
              posts: {
                data: [
                  {
                    id: 1,
                    title: "Post 1",
                    slug: "post-1",
                    description: "Post Description 1",
                    content: "Post Content 1",
                    status: "draft",
                    image: "image1.png",
                  },
                  {
                    id: 2,
                    title: "Post 2",
                    slug: "post-2",
                    description: "Post Description 2",
                    content: "Post Content 2",
                    status: "draft",
                    image: "image2.png",
                  },
                  {
                    id: 3,
                    title: "Post 3",
                    slug: "post-3",
                    description: "Post Description 3",
                    content: "Post Content 3",
                    status: "draft",
                    image: "image3.png",
                  },
                ],
                links: {
                  first: "#",
                  last: "#",
                  prev: null,
                  next: null,
                },
                meta: {
                  current_page: 1,
                  from: 1,
                  last_page: 1,
                  links: [
                    {
                      url: null,
                      label: "&laquo; Previous",
                      active: false,
                    },
                    {
                      url: "#",
                      label: "1",
                      active: true,
                    },
                    {
                      url: null,
                      label: "Next &raquo;",
                      active: false,
                    },
                  ],
                  path: "#",
                  per_page: 5,
                  to: 3,
                  total: 3,
                },
              },
            },
          },
        }),
      ],
    },
    props: {
      searchData: {
        rowsPerPage: 5,
        searchName: "",
        searchStatus: "",
      },
    },
  });

  await flushPromises(); // Wait for asynchronous operations to complete

  const store = usePostStore();

  test("Displays Correct no of Datas and displays Page Details inside the tbody", () => {
    // Assert that the component renders correctly
    expect(wrapper.html()).toMatchSnapshot();

    // Additional assertions as needed
    expect(wrapper.find("table")).not.toBe(null); // Check if table exists
    expect(wrapper.findAll("tbody tr")).toHaveLength(4); // Check if 4 rows are rendered 3 data and 1 for no of pages

    // Assert that the component renders correctly
    expect(wrapper.exists()).toBe(true);

    // Assert that the table is rendered
    const table = wrapper.find("table");
    expect(table.exists()).toBe(true);

    // Assert that the table headers are rendered
    const tableHeaders = table.findAll("thead th");
    expect(tableHeaders.length).toBe(5); // Ensure correct number of headers

    // Assert that the "Page 1 of 1" page no is displayed
    const noPostsMessage = wrapper.find('tbody > tr > td[colspan="2"]');
    expect(noPostsMessage.exists()).toBe(true);
    expect(noPostsMessage.text()).toContain("Page 1 of 1");

    // Check if TailwindPagination component is rendered inside MyComponent
    expect(wrapper.findComponent(TailwindPagination).exists()).toBe(true);
  });

  test("test checkbox adds record ids to the selected posts ref correctly", async () => {
    // Assert that the buttons are not rendered
    expect(wrapper.find('[data-testId="publish-all"]').exists()).toBe(false);
    expect(wrapper.find('[data-testId="deletes-all"]').exists()).toBe(false);

    // Simulate checkbox all change
    const checkboxAll = wrapper.find("input[data-testId=checkbox-all]");
    await checkboxAll.trigger("click");
    await checkboxAll.trigger("change");

    // Assert that the selected posts are updated in the store
    expect(store.selectedPosts).toEqual([1, 2, 3]);

    // Assert that the buttons are rendered
    expect(wrapper.find('[data-testId="publish-all"]').exists()).toBe(true);
    expect(wrapper.find('[data-testId="deletes-all"]').exists()).toBe(true);

    store.selectedPosts = [];

    await flushPromises();

    // Simulate checkbox all change
    const checkboxID1 = wrapper.find("input[data-testId=checkbox-1]");
    await checkboxID1.trigger("click");
    await checkboxID1.trigger("change");

    // Assert that the selected posts are updated in the store
    expect(store.selectedPosts).toEqual([1]);

    // Simulate checkbox all change
    const checkboxID2 = wrapper.find("input[data-testId=checkbox-2]");
    await checkboxID2.trigger("click");
    await checkboxID2.trigger("change");

    // Assert that the selected posts are updated in the store
    expect(store.selectedPosts).toEqual([1, 2]);
  });
});

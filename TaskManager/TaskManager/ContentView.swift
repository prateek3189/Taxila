import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = TaskViewModel()
    @State private var showingAddTask = false

    private var pendingTasks: [Task] { viewModel.tasks.filter { !$0.isCompleted } }
    private var completedTasks: [Task] { viewModel.tasks.filter { $0.isCompleted } }

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.tasks.isEmpty {
                    emptyState
                } else {
                    taskList
                }
            }
            .navigationTitle("My Tasks")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    if !viewModel.tasks.isEmpty { EditButton() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        showingAddTask = true
                    } label: {
                        Image(systemName: "plus")
                            .fontWeight(.semibold)
                    }
                }
            }
            .sheet(isPresented: $showingAddTask) {
                AddTaskView(viewModel: viewModel)
            }
        }
    }

    private var taskList: some View {
        List {
            if !pendingTasks.isEmpty {
                Section("Pending") {
                    ForEach(pendingTasks) { task in
                        TaskRowView(task: task) {
                            viewModel.toggleCompletion(for: task)
                        }
                    }
                    .onDelete { offsets in
                        deleteFrom(pendingTasks, offsets: offsets)
                    }
                }
            }

            if !completedTasks.isEmpty {
                Section("Completed") {
                    ForEach(completedTasks) { task in
                        TaskRowView(task: task) {
                            viewModel.toggleCompletion(for: task)
                        }
                    }
                    .onDelete { offsets in
                        deleteFrom(completedTasks, offsets: offsets)
                    }
                }
            }
        }
    }

    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "checkmark.circle")
                .font(.system(size: 64))
                .foregroundColor(.secondary)
            Text("No tasks yet")
                .font(.title2)
                .fontWeight(.semibold)
            Text("Tap + to add your first task")
                .foregroundColor(.secondary)
        }
    }

    private func deleteFrom(_ source: [Task], offsets: IndexSet) {
        let idsToDelete = offsets.map { source[$0].id }
        let masterOffsets = IndexSet(
            viewModel.tasks.indices.filter { idsToDelete.contains(viewModel.tasks[$0].id) }
        )
        viewModel.deleteTask(at: masterOffsets)
    }
}

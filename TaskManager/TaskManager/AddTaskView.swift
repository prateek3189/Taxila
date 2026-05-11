import SwiftUI

struct AddTaskView: View {
    @ObservedObject var viewModel: TaskViewModel
    @Environment(\.dismiss) private var dismiss
    @State private var taskTitle = ""
    @FocusState private var isFocused: Bool

    private var isValid: Bool {
        !taskTitle.trimmingCharacters(in: .whitespaces).isEmpty
    }

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    TextField("What do you need to do?", text: $taskTitle)
                        .focused($isFocused)
                        .submitLabel(.done)
                        .onSubmit { addAndDismiss() }
                }
            }
            .navigationTitle("New Task")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") { addAndDismiss() }
                        .disabled(!isValid)
                        .fontWeight(.semibold)
                }
            }
            .onAppear { isFocused = true }
        }
    }

    private func addAndDismiss() {
        guard isValid else { return }
        viewModel.addTask(title: taskTitle)
        dismiss()
    }
}

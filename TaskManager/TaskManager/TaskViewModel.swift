import Foundation
import Combine

class TaskViewModel: ObservableObject {
    @Published var tasks: [Task] = []

    private let saveKey = "saved_tasks"

    init() {
        loadTasks()
    }

    func addTask(title: String) {
        let trimmed = title.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }
        tasks.append(Task(title: trimmed))
        saveTasks()
    }

    func deleteTask(at offsets: IndexSet) {
        tasks.remove(atOffsets: offsets)
        saveTasks()
    }

    func toggleCompletion(for task: Task) {
        guard let index = tasks.firstIndex(where: { $0.id == task.id }) else { return }
        tasks[index].isCompleted.toggle()
        saveTasks()
    }

    private func saveTasks() {
        if let encoded = try? JSONEncoder().encode(tasks) {
            UserDefaults.standard.set(encoded, forKey: saveKey)
        }
    }

    private func loadTasks() {
        guard let data = UserDefaults.standard.data(forKey: saveKey),
              let decoded = try? JSONDecoder().decode([Task].self, from: data) else { return }
        tasks = decoded
    }
}

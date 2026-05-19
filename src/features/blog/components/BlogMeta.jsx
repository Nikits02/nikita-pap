import {
  CalendarCardIcon,
  ClockCircleIcon,
  UserCircleIcon,
} from "../../../shared/components/icons/CommonIcons";

function BlogMeta({ post }) {
  return (
    <div className="blog-meta">
      <span>
        <ClockCircleIcon />
        {post.leitura}
      </span>
      <span>
        <CalendarCardIcon />
        {post.data}
      </span>
      <span>
        <UserCircleIcon />
        {post.autor}
      </span>
    </div>
  );
}

export default BlogMeta;
